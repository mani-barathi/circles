import React, { useEffect, useState } from "react"
import Link from "next/link"
import debounce from "lodash/debounce"
import {
  useGetCirclesQuery,
  useSearchCircleLazyQuery,
} from "../generated/graphql"

interface exploreProps {}

const index: React.FC<exploreProps> = ({}) => {
  const { data, loading, error } = useGetCirclesQuery()
  const [circles, setCircles] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isNoResultsFound, setIsNoResultsFound] = useState(false)
  const [
    searchCircle,
    { data: searchData, loading: searchLoading, fetchMore },
  ] = useSearchCircleLazyQuery({ fetchPolicy: "no-cache" })

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
      <h3>Circles</h3>
      <p>
        <input type="text" onChange={handleOnChange} placeholder="search" />
      </p>

      {searchLoading && <p>Loading...</p>}
      {isNoResultsFound && <p>No Results Found</p>}

      {circles.map((circle) => (
        <div key={circle.id}>
          <Link href={`/circle/${circle.id}`}>
            <a>
              <h3 style={{ margin: "0" }}>{circle.name}</h3>
            </a>
          </Link>
          <strong>
            creator: {circle.creator.username} &nbsp;|&nbsp; members:
            {circle.totalMembers}
          </strong>
        </div>
      ))}

      <br />
      {circles.length > 0 && (
        <div>
          <button disabled={!hasMore} onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}

      {/* 
      {data?.getCircles.map((circle) => (
        <div key={circle.id}>
          <Link href={`/circle/${circle.id}`}>
            <a>
              <h3>{circle.name}</h3>
            </a>
          </Link>
          <h4>Creator : {circle.creator.username}</h4>
          <hr />
        </div>
      ))} */}
    </div>
  )
}

export default index
