import { gql, type TypedDocumentNode } from "@apollo/client";

export type Character = {
  name: string;
}
export type Episode = {
  episode: {
    name: string;
    characters: Array<Character>;
  }
}

export const CHARACTERS_IN_EPISODE: TypedDocumentNode<Episode, string>= gql`
  query Episode($id: ID!) {
    episode(id: $id) {
      name
      characters {
        name
      }
    }
  }
`