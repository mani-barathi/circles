import "../styles/globals.css";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import Navbar from "../components/Navbar";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <div style={{ padding: "0 1rem" }}>
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

export default MyApp;
