// export function useUser(limit, offset) {
//   const { data, loading, error } = useQuery(jobsQuery, {
//     variables: { limit, offset },
//     fetchPolicy: 'network-only',
//   });
//   return { jobs: data?.jobs, loading, error: Boolean(error) };
// }

import { useQuery } from "@apollo/client/react";
import { GET_INCOMPLETE_QUOTES, GET_USER } from "./queries";

export function useUserByEmail(email: string) {
  const { data } = useQuery(GET_USER, {
    variables: { email }
  });
  console.log(data);
  return data;
}


export async function useIncompleteQuote(ownerid: string) {
  // const { loading, error, data } = useQuery(GET_INCOMPLETE_QUOTES, {
  //   variables: { ownerid }
  // });
  const response = await fetch("http://localhost:4000/graphql", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query Quotes($ownerid: String!) {
          incompleteQuotesForUser(ownerid: $ownerid) {
            id
            insurance_type
          }
        }
      `,
      variables: { ownerid },
    }),
  });
  const data = (await response.json()).data.incompleteQuotesForUser;
  // console.log(data);

  return data;
}