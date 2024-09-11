import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    accessToken
    _id
    email
  }
}`

export const LOGIN_TRX = gql`
query UserLoginTrxAll($id: String!) {
  userLoginTrxAll(_id: $id) {
    user {
      _id
      name
      username
      email
    }
    result {
      _id
      nominal
      userId
      walletId
      type
      category
      note
    }
    income {
      _id
      nominal
      userId
      walletId
      type
      category
      note
    }
    expense {
      _id
      nominal
      userId
      walletId
      type
      category
      note
    }
    wallet {
      _id
      name
      type
      ownerId
      total
    }
  }
}`

export const SEARCH_USER = gql`
query SearchUser($keywords: String) {
  searchUser(keywords: $keywords) {
    _id
    name
    username
    email
  }
}`