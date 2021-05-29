import { RetryLink } from "@apollo/client/link/retry"
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities"
import { createUploadLink } from "apollo-upload-client"
import { SubscriptionClient } from "subscriptions-transport-ws"

const baseUrl = process.env.NEXT_PUBLIC_API_URL
const httpLink = createUploadLink({
  uri: `${baseUrl}/graphql`,
  credentials: "include",
})

export const subscriptionClient = process.browser
  ? new SubscriptionClient(`${baseUrl}/subscriptions`, {
      lazy: true,
      reconnect: true,
    })
  : null

const webSocketLink = process.browser
  ? new WebSocketLink(subscriptionClient)
  : null

const link = process.browser
  ? new RetryLink({ attempts: { max: Infinity } }).split(
      ({ query }) => {
        const definition = getMainDefinition(query)

        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        )
      },
      webSocketLink,
      httpLink
    )
  : httpLink

export default link
