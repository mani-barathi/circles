import { ApolloClient, createHttpLink } from "@apollo/client"
import cache from "./cache"

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
})

const client = new ApolloClient({
  link: httpLink,
  cache,
  connectToDevTools: true,
})

export default client
