import { InMemoryCache } from "@apollo/client"
import {
  PaginatedCircle,
  PaginatedMessage,
  PaginatedPost,
} from "../generated/graphql"

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        myCircles: {
          keyArgs: false,
          merge(
            existingCircles: PaginatedCircle,
            incomingCircles: PaginatedCircle,
            { readField }
          ): PaginatedCircle {
            if (!existingCircles) return incomingCircles
            if (!incomingCircles) return existingCircles
            const data = removeDuplicatesAndMerge(
              existingCircles.data,
              incomingCircles.data
            )
            data.sort(
              (d1, d2) =>
                (readField("updatedAt", d2) as number) -
                (readField("updatedAt", d1) as number)
            )
            return {
              ...incomingCircles,
              data,
            }
          },
        }, // end of myCircles
        posts: {
          keyArgs: ["circleId"],
          merge(
            existingPosts: PaginatedPost,
            incomingPosts: PaginatedPost,
            { readField }
          ): PaginatedPost {
            if (!existingPosts) return incomingPosts
            if (!incomingPosts) return existingPosts
            const data = removeDuplicatesAndMerge(
              existingPosts.data,
              incomingPosts.data
            )
            data.sort(
              (p1, p2) =>
                (readField("createdAt", p2) as number) -
                (readField("createdAt", p1) as number)
            )
            return {
              __typename: incomingPosts.__typename,
              hasMore: incomingPosts.hasMore,
              data,
            }
          },
        }, // end of posts
        myPosts: {
          keyArgs: ["circleId"],
          merge(
            existingPosts: PaginatedPost,
            incomingPosts: PaginatedPost,
            { readField }
          ): PaginatedPost {
            if (!existingPosts) return incomingPosts
            if (!incomingPosts) return existingPosts
            const data = removeDuplicatesAndMerge(
              existingPosts.data,
              incomingPosts.data
            )
            data.sort(
              (p1, p2) =>
                (readField("createdAt", p2) as number) -
                (readField("createdAt", p1) as number)
            )
            return {
              __typename: incomingPosts.__typename,
              hasMore: incomingPosts.hasMore,
              data,
            }
          },
        }, // end of myPosts
        messages: {
          keyArgs: ["circleId"],
          merge(
            existingMessages: PaginatedMessage,
            incomingMessages: PaginatedMessage,
            { readField }
          ): PaginatedMessage {
            if (!existingMessages) return incomingMessages
            if (!incomingMessages) return existingMessages
            const data = removeDuplicatesAndMerge(
              existingMessages.data,
              incomingMessages.data
            )
            data.sort(
              (m1, m2) =>
                (readField("createdAt", m2) as number) -
                (readField("createdAt", m1) as number)
            )
            return {
              __typename: incomingMessages.__typename,
              hasMore: incomingMessages.hasMore,
              data,
            }
          },
        }, // end of messages
      }, // end of fields
    },
  },
})

const removeDuplicatesAndMerge = (existingArray, incomingArray): any[] => {
  let newArray = []

  for (let iObj of incomingArray) {
    let isPresent = false
    for (let eObj of existingArray) {
      if (eObj.__ref === iObj.__ref) {
        isPresent = true
      }
    }
    if (!isPresent) {
      newArray.push(iObj)
    }
  }
  newArray = [...existingArray, ...newArray]
  return newArray
}

export default cache
