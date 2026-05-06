import { gql, type TypedDocumentNode } from "@apollo/client";
import type { User } from "~/context/UserProvider";

// In a real application, consider generating types from your schema
// instead of writing them by hand
type GetGreetingType = {
  greeting: string;
}

// export const GET_GREETING = gql`
export const GET_GREETING: TypedDocumentNode<GetGreetingType> = gql`
  query Query {
    greeting
  }
`

export const GET_USER: TypedDocumentNode<User> = gql`
  query Users($email: String!) {
    userByEmail(email: $email) {
      fname
      lname
      email
      dob
      id
    }
  }
`

// type UserInput = Omit<User, 'id'>;

export const ADD_USER: TypedDocumentNode<User|null, Omit<User, 'id'>> = gql`
  mutation AddUser($user: UserInput!) {
    addUser(user: $user) {
      id
      fname
      lname
      email
      dob
    }
  }
`

export const GET_INCOMPLETE_QUOTES = gql`
  query Quotes($ownerid: String!) {
    incompleteQuotesForUser(ownerid: $ownerid) {
      id
      insurance_type
    }
  }
`
