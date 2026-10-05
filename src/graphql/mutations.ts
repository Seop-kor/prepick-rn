import { graphql } from "./__generated__";

export const login = graphql(`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      accessTokenExpiresAt
      refreshToken
      refreshTokenExpiresAt
      user {
        id
        name
        phone
        createdAt
        __typename
      }
      __typename
    }
  }
`);

export const refreshSession = graphql(`
  mutation refreshSession($refreshToken: String!) {
    refreshSession(refreshToken: $refreshToken) {
      accessToken
      accessTokenExpiresAt
      refreshToken
      refreshTokenExpiresAt
      user {
        id
        name
        phone
        createdAt
        __typename
      }
      __typename
    }
  }
`);
