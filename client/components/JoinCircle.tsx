import gql from "graphql-tag"
import React from "react"
import { useJoinCircleMutation } from "../generated/graphql"

interface JoinCircleProps {
  circleId: number
}

const JoinCircle: React.FC<JoinCircleProps> = ({ circleId }) => {
  const [JoinCircle, { loading }] = useJoinCircleMutation({})

  const handleJoinCircle = async () => {
    try {
      await JoinCircle({
        variables: { circleId },
        update: (cache, { data }) => {
          if (!data || !data.joinCircle) {
            alert("Unable to join the circle, maybe the circle is private")
            return
          }

          cache.writeFragment({
            id: "Circle:" + circleId,
            fragment: gql`
              fragment __ on Circle {
                isMember
              }
            `,
            data: { isMember: true },
          })
          alert("You have joined the cirle")
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
      onClick={handleJoinCircle}
      className="btn btn-info"
    >
      Join Circle
    </button>
  )
}

export default JoinCircle
