import { gql } from "@apollo/client";

export const FOLLOW = gql`
mutation Follow($followingId: String!) {
  follow(followingId: $followingId) {
    _id
    followingId
    followerId
    createdAt
    updatedAt
  }
}`