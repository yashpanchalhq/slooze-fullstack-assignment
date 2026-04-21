import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
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

export const SIGNUP_MUTATION = gql`
  mutation SignUp($signUpInput: SignUpInput!) {
    signUp(signUpInput: $signUpInput) {
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
