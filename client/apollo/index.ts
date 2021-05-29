import { ApolloClient } from "@apollo/client"
import cache from "./cache"
import link from "./link"

const client = new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
})

export default client
