import { ApolloError } from '@apollo/client';

const err = new ApolloError({
  graphQLErrors: [{ message: 'Invalid credentials' } as any]
});
console.log('ApolloError test:', JSON.stringify({
  message: err.message,
  graphQLErrors: err.graphQLErrors,
  networkError: err.networkError
}, null, 2));

