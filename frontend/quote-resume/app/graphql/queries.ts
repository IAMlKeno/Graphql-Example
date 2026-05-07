import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Quote } from "~/context/QuoteProvider";
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

export type UserInput = Omit<User, 'id'>;

export const ADD_USER: TypedDocumentNode<User|null, UserInput> = gql`
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
export type QuoteInput = Omit<Quote, 'id'>;
export const ADD_QUOTE: TypedDocumentNode<Quote|null, QuoteInput> = gql`
  mutation AddQuote($quote: QuoteInput!) {
    addQuote(quote: $quote) {
      id
      estimate
      insurance_type
      ownerid
    }
  }
`
export const UPDATE_QUOTE: TypedDocumentNode<Quote|null, Quote> = gql`
  mutation UpdateQuote($id: ID!, $quote: QuoteInput!) {
    updateQuote(id: $id, quote: $quote) {
      id
      estimate
      insurance_type
      ownerid
    }
  }
`

export const GET_INCOMPLETE_QUOTES: TypedDocumentNode<Array<Quote>, string> = gql`
  query Quotes($ownerid: String!) {
    incompleteQuotesForUser(ownerid: $ownerid) {
      id
      insurance_type
      date_submitted
      estimate
    }
  }
`
