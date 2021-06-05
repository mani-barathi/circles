import React from "react"
import gql from "graphql-tag"
import { useRouter } from "next/router"
import {
  useTogglePublicCircleMutation,
  useDeleteCircleMutation,
} from "../generated/graphql"

interface SettingsDangerZoneProps {
  circleId: number
  isPublic: boolean
}

const SettingsDangerZone: React.FC<SettingsDangerZoneProps> = ({
  circleId,
  isPublic,
}) => {
  const router = useRouter()
  const [deleteCircle, { loading: deleteLoading }] = useDeleteCircleMutation()
  const [togglePublic, { loading: togglePublicLoading }] =
    useTogglePublicCircleMutation()

  const handleDeleteCircle = async () => {
    if (!confirm("Are you sure to Delete the circle")) return

    const variables = { circleId }

    try {
      const { data } = await deleteCircle({
        variables,
        update: (cache, { data }) => {
          if (!data || !data.deleteCircle) return

          const normalizedId = cache.identify({
            id: circleId,
            __typename: "Circle",
          })
          cache.evict({ id: normalizedId })
          cache.gc()
        },
      })
      if (data && data.deleteCircle) {
        router.push("/")
      }
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  const handleTogglePublic = async () => {
    const variables = {
      circleId,
      isPublic: !isPublic,
    }
    const promptText = variables.isPublic
      ? "Are you sure to make the circle public?"
      : "Are you to make the circle private?"

    if (!confirm(promptText)) return

    try {
      await togglePublic({
        variables,
        update: (cache, { data }) => {
          if (!data || !data.togglePublicCircle) return

          cache.writeFragment({
            id: "Circle:" + circleId,
            fragment: gql`
              fragment __ on Circle {
                isPublic
              }
            `,
            data: { isPublic: !isPublic },
          })
        },
      })
    } catch (e) {
      console.log("handleTogglePublic", e)
    }
  }

  return (
    <div>
      <h4>Danger Zone</h4>
      <ul className="list-group border border-danger">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h6>Change circle visibility</h6>
            <p className="m-0">
              Circle is currently {isPublic ? " Public" : " Private"}
            </p>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleTogglePublic}
            disabled={togglePublicLoading}
          >
            {isPublic ? "Convert to Private" : "Convert to Public"}
          </button>
        </li>

        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h6>Delete this circle</h6>
            <p className="m-0">
              Once you delete a circle, there is no going back. Please be
              certain.
            </p>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            disabled={deleteLoading}
            onClick={handleDeleteCircle}
          >
            Delete Circle
          </button>
        </li>
      </ul>
    </div>
  )
}

export default SettingsDangerZone
