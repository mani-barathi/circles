import { ApolloCache } from "@apollo/client"
import gql from "graphql-tag"
import React from "react"
import {
  LikeOrDislikeMutation,
  Post,
  useLikeOrDislikeMutation,
} from "../generated/graphql"

interface LikeButtonProps {
  circleId: number
  postId: number
  hasLiked: boolean
  likesCount: number
}

const LikeButton: React.FC<LikeButtonProps> = ({
  circleId,
  postId,
  hasLiked,
  likesCount,
}) => {
  const [likeOrDislike, { loading }] = useLikeOrDislikeMutation()

  const handleLikeDislike = async () => {
    try {
      await likeOrDislike({
        variables: { circleId, postId, isDislike: hasLiked },
        update: (cache: ApolloCache<LikeOrDislikeMutation>, { data }) => {
          if (!data.likeOrDislike) return
          // const previousData = cache.readFragment({
          //   id: "Post:" + postId,
          //   fragment: gql`
          //     fragment __ on Post {
          //       hasLiked
          //       likesCount
          //     }
          //   `,
          // })
          // console.log(previousData)
          const newLikesCount = hasLiked ? likesCount - 1 : likesCount + 1
          cache.writeFragment({
            id: "Post:" + postId,
            fragment: gql`
              fragment __ on Post {
                hasLiked
                likesCount
              }
            `,
            data: { hasLiked: !hasLiked, likesCount: newLikesCount },
          })
        },
      })
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }
  return (
    <button disabled={loading} onClick={handleLikeDislike}>
      {hasLiked ? "Liked" : "Like"} : {likesCount}
    </button>
  )
}

export default LikeButton
