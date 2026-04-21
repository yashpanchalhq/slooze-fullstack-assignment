import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client/core';
import "cross-fetch/polyfill";

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  fetch,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({ addTypename: false }),
});

const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id
        email
        name
        role
        country
      }
    }
  }
`;

client.mutate({
  mutation: LOGIN_MUTATION,
  variables: {
    loginInput: { email: 'nick.fury@slooze.com', password: 'password123' },
  },
})
.then(res => console.log('Success:', res.data.login.access_token.slice(0, 10) + '...'))
.catch(err => {
  console.error('Error raw object keys:', Object.keys(err));
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  if (err.graphQLErrors) console.error('GraphQL errors:', err.graphQLErrors);
  if (err.networkError) console.error('Network errors:', err.networkError);
});
