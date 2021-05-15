import gql from "graphql-tag"
import React from "react"
import { useLikeOrDislikeMutation } from "../generated/graphql"

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
        update: (cache, { data }) => {
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
    <button
      disabled={loading}
      className={`btn btn-sm ${hasLiked ? "btn-info" : "btn-outline-info"}`}
      onClick={handleLikeDislike}
      title={!hasLiked ? "like" : "dislike"}
    >
      Likes : <span>{likesCount}</span>
    </button>
  )
}

export default LikeButton
