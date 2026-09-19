/// <reference types="vite/client" />
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const backendUrl = (import.meta as any).env?.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';

const httpLink = createHttpLink({
  uri: backendUrl,
  credentials: 'include' // Obligatorio según arquitectura para transmitir cookies HttpOnly
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only'
    },
    query: {
      fetchPolicy: 'network-only'
    }
  }
});
