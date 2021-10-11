import { gql, useQuery } from "@apollo/client";
import { User } from "../../generated/graphql";

const GET_USER_ME = gql`
  query GetUserMe {
    user {
      id
      displayName
      avatar
    }
  }
`;

export const useUser = () => {
  const { data, error, loading } = useQuery<{ user: User }>(GET_USER_ME);
  // console.log(data);
  return { user: data?.user, error, loading };
};
