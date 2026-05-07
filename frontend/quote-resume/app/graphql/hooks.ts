import { useQuery } from "@apollo/client/react";
import { GET_USER } from "./queries";

export function useUserByEmail(email: string) {
  const { data } = useQuery(GET_USER, {
    variables: { email }
  });
  console.log(data);
  return data;
}
