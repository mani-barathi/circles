import debounce from "lodash/debounce"
import Link from "next/link"
import React, { useEffect, useCallback, useState } from "react"
import SearchIcon from "../components/icons/SearchIcon"
import Spinner from "../components/Spinner"
import {
  useGetCirclesQuery,
  useSearchCircleLazyQuery,
} from "../generated/graphql"

interface exploreProps {}

const index: React.FC<exploreProps> = ({}) => {
  const { data } = useGetCirclesQuery({
    fetchPolicy: "no-cache",
    nextFetchPolicy: "cache-only",
  })
  const [circles, setCircles] = useState([])
  const [input, setInput] = useState("")
  const [hasMore, setHasMore] = useState(true)
  const [isNoResultsFound, setIsNoResultsFound] = useState(false)
  const [
    searchCircle,
    { data: searchData, loading: searchLoading, fetchMore },
  ] = useSearchCircleLazyQuery({
    fetchPolicy: "no-cache",
    nextFetchPolicy: "cache-only",
  })

  useEffect(() => {
    if (!searchData || !searchData?.searchCircle) return
    setCircles(searchData.searchCircle.data)
    setHasMore(searchData.searchCircle.hasMore)
    if (searchData.searchCircle.data.length === 0) {
      setIsNoResultsFound(true)
    } else {
      setIsNoResultsFound(false)
    }
  }, [searchData])

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const query = e.target.value
    setInput(query)
    setCircles([])
    if (!query) {
      return setIsNoResultsFound(false)
    }
    handleSearch(query)
  }

  const handleSearch = useCallback(
    debounce((query: string) => {
      try {
        searchCircle({ variables: { query } })
      } catch (e) {
        console.log(e)
      }
    }, 400),
    []
  )

  const handleLoadMore = async () => {
    const cursor = circles[circles.length - 1].updatedAt
    try {
      const { data }: any = await fetchMore({
        variables: { cursor, query: input },
      })
      setCircles((p) => [...p, ...data.searchCircle.data])
      setHasMore(data.searchCircle.hasMore)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="app__window">
      <div className="d-flex justify-content-between align-items-center p-1 my-2 shadow-sm border bg-white rounded">
        <input
          type="search"
          style={{ fontSize: "1.1rem", outline: "none" }}
          className="border-0 py-2 px-4 flex-grow-1"
          onChange={handleOnChange}
          placeholder="search"
        />
        <span className="ml-2 mr-2" style={{ cursor: "pointer" }}>
          <SearchIcon />
        </span>
      </div>

      {searchLoading && <Spinner center={true} />}

      <div className="list-group">
        {circles.length > 0 ? (
          circles.map((c) => <SearchCircle key={c.id} circle={c} />)
        ) : input && isNoResultsFound ? (
          <p className="text-center">No Results Found</p>
        ) : (
          data?.getCircles?.map((c) => <SearchCircle key={c.id} circle={c} />)
        )}
      </div>

      {circles.length > 0 && (
        <button
          className="btn btn-secondary btn-sm mt-2 mb-5"
          disabled={!hasMore}
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )}
    </div>
  )
}

const SearchCircle: React.FC<{ circle: any }> = ({ circle }) => {
  return (
    <div key={circle.id} className="list-group-item">
      <div className="d-flex justify-content-between">
        <Link href={`/circle/${circle.id}`}>
          <a>
            <h5>
              <span>{circle.name}</span>
            </h5>
          </a>
        </Link>
        <small className="ml-3 text-primary font-weight-bold">
          {circle.isPublic ? "Public" : "Private"}
        </small>
      </div>
      <strong>
        <span> Creator: {circle.creator.username}</span>
        <span className="ml-3">Members: {circle.totalMembers}</span>
      </strong>
    </div>
  )
}

export default index
