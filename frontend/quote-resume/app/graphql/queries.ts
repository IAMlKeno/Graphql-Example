import { gql, type TypedDocumentNode } from "@apollo/client";

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
