import { ApolloLink, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { errorLink, traceLink } from "~/logging/apollo";

const localLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});
const rickMLink = new HttpLink({
  uri: "https://rickandmortyapi.com/graphql",
});

export const getClient = () => new ApolloClient({
  link: ApolloLink.from([traceLink, errorLink, localLink]),
  cache: new InMemoryCache()
});

export const getRickMortyClient = () => new ApolloClient({
  link: ApolloLink.from([rickMLink]),
  cache: new InMemoryCache()
})
