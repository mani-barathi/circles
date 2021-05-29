import { RetryLink } from "@apollo/client/link/retry"
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities"
import { createUploadLink } from "apollo-upload-client"
import { SubscriptionClient } from "subscriptions-transport-ws"

const domain = process.env.NEXT_PUBLIC_API_URL
const PROD = process.env.NEXT_PUBLIC_NODE_ENV === "production"
const graphqlUrl = PROD
  ? `https://${domain}/graphql`
  : `http://${domain}/graphql`
const wsUrl = PROD
  ? `wss://${domain}/subscriptions`
  : `ws://${domain}/subscriptions`

const httpLink = createUploadLink({
  uri: graphqlUrl,
  credentials: "include",
})

export const subscriptionClient = process.browser
  ? new SubscriptionClient(wsUrl, {
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
