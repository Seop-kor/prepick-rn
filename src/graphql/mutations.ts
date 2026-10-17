import { graphql } from './__generated__';

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

export const sendSignupOtp = graphql(`
  mutation sendSignupOtp($phone: String!) {
    sendSignupOtp(phone: $phone) {
      expiresAt
      retryAfterSeconds
      __typename
    }
  }
`);

export const verifySignupOtp = graphql(`
  mutation verifySignupOtp($phone: String!, $code: String!) {
    verifySignupOtp(phone: $phone, code: $code) {
      expiresAt
      verificationToken
      __typename
    }
  }
`);

export const signUp = graphql(`
  mutation signUp($input: SignUpInput!) {
    signUp(input: $input) {
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
