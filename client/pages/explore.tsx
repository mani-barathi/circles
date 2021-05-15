import React, { useEffect, useState } from "react"
import Link from "next/link"
import debounce from "lodash/debounce"
import {
  useGetCirclesQuery,
  useSearchCircleLazyQuery,
} from "../generated/graphql"

interface exploreProps {}

const index: React.FC<exploreProps> = ({}) => {
  const { data } = useGetCirclesQuery()
  const [circles, setCircles] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isNoResultsFound, setIsNoResultsFound] = useState(false)
  const [
    searchCircle,
    { data: searchData, loading: searchLoading, fetchMore },
  ] = useSearchCircleLazyQuery({ fetchPolicy: "no-cache" })

  useEffect(() => {
    if (!data || !data?.getCircles) return
    setCircles(data.getCircles)
  }, [data])

  useEffect(() => {
    if (!searchData || !searchData?.searchCircle) return
    setCircles(searchData.searchCircle.data)
    setHasMore(searchData.searchCircle.hasMore)
    if (searchData.searchCircle.data.length === 0) {
      setIsNoResultsFound(true)
    }
  }, [searchData])

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const query = e.target.value
    if (!query) {
      setIsNoResultsFound(false)
      // setCircles([])
      return
    }
    handleSearch(query)
  }

  const handleSearch = debounce((query: string) => {
    try {
      searchCircle({ variables: { query } })
    } catch (e) {
      console.log(e)
    }
  }, 500)

  const handleLoadMore = () => {}

  return (
    <div>
      <p className="d-flex align-items-center mt-2">
        <input
          type="text"
          className="form-control form-control-lg"
          onChange={handleOnChange}
          placeholder="search"
        />
        <button className="ml-2 btn btn-info btn-lg">Search</button>
      </p>

      {searchLoading && <p>Loading...</p>}
      {isNoResultsFound && <p>No Results Found</p>}

      <div className="list-group">
        {circles.map((circle) => (
          <div key={circle.id} className="list-group-item">
            <Link href={`/circle/${circle.id}`}>
              <a>
                <h5>{circle.name}</h5>
              </a>
            </Link>
            <strong>
              <span> Creator: {circle.creator.username}</span>
              <span className="ml-3">Members: {circle.totalMembers}</span>
            </strong>
          </div>
        ))}
      </div>

      {circles.length > 0 && (
        <button
          className="btn btn-primary btn-sm mt-2"
          disabled={!hasMore}
          onClick={handleLoadMore}
        >
          Load More
        </button>
      )}
    </div>
  )
}

export default index
