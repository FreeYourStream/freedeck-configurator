import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type Collection = {
  __typename?: 'Collection';
  name: Scalars['String'];
  tags: Array<Scalars['String']>;
  pages: Array<Page>;
  createdBy: User;
  id: Scalars['String'];
  upvotes: Scalars['String'];
};

export type CollectionCreateInput = {
  name: Scalars['String'];
  tags: Array<Scalars['String']>;
  pageIds?: Maybe<Array<Scalars['String']>>;
};

export type CollectionUpdateInput = {
  name?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
  pageIds?: Maybe<Array<Scalars['String']>>;
};


export type Mutation = {
  __typename?: 'Mutation';
  collectionCreate: Scalars['String'];
  collectionUpdate: Scalars['Boolean'];
  collectionToggleUpvote: Scalars['Boolean'];
  pageCreate: Scalars['String'];
  pageUpdate: Page;
  pageToggleUpvote: Scalars['Boolean'];
};


export type MutationCollectionCreateArgs = {
  input: CollectionCreateInput;
};


export type MutationCollectionUpdateArgs = {
  input: CollectionUpdateInput;
  id: Scalars['String'];
};


export type MutationCollectionToggleUpvoteArgs = {
  id: Scalars['String'];
};


export type MutationPageCreateArgs = {
  input: PageCreateInput;
};


export type MutationPageUpdateArgs = {
  input: PageUpdateInput;
};


export type MutationPageToggleUpvoteArgs = {
  id: Scalars['String'];
};

export type Page = {
  __typename?: 'Page';
  id: Scalars['String'];
  tags: Array<Scalars['String']>;
  width: Scalars['Int'];
  height: Scalars['Int'];
  data: Scalars['JSON'];
  createdBy: User;
  forkedFrom?: Maybe<Page>;
  upvotes: Scalars['Float'];
};

export type PageCreateInput = {
  id: Scalars['String'];
  tags: Array<Scalars['String']>;
  width: Scalars['Int'];
  height: Scalars['Int'];
  data: Scalars['JSON'];
  forkedFromId?: Maybe<Scalars['String']>;
};

export type PageUpdateInput = {
  id?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  data?: Maybe<Scalars['JSON']>;
};

export type PaginatedPages = {
  __typename?: 'PaginatedPages';
  hasNext: Scalars['Boolean'];
  pages: Array<Page>;
};

export type Pagination = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  myCollections: Array<Collection>;
  searchCollections: Array<Collection>;
  collection: Collection;
  page: Page;
  myPages: Array<Page>;
  searchPages: PaginatedPages;
  user: User;
};


export type QuerySearchCollectionsArgs = {
  searchTerm: Scalars['String'];
};


export type QueryCollectionArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryPageArgs = {
  id: Scalars['String'];
};


export type QuerySearchPagesArgs = {
  pagination?: Maybe<Pagination>;
  searchTerm: Scalars['String'];
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  displayName: Scalars['String'];
  avatar: Scalars['String'];
  id: Scalars['String'];
};

export type PageFieldsFragment = (
  { __typename?: 'Page' }
  & Pick<Page, 'id' | 'data' | 'width' | 'height' | 'upvotes' | 'tags'>
  & { createdBy: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'avatar' | 'displayName'>
  ), forkedFrom?: Maybe<(
    { __typename?: 'Page' }
    & Pick<Page, 'id'>
  )> }
);

export type SearchPagesQueryVariables = Exact<{
  searchTerm: Scalars['String'];
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
}>;


export type SearchPagesQuery = (
  { __typename?: 'Query' }
  & { searchPages: (
    { __typename?: 'PaginatedPages' }
    & Pick<PaginatedPages, 'hasNext'>
    & { pages: Array<(
      { __typename?: 'Page' }
      & PageFieldsFragment
    )> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'avatar' | 'displayName'>
  ) }
);

export type MyPagesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPagesQuery = (
  { __typename?: 'Query' }
  & { myPages: Array<(
    { __typename?: 'Page' }
    & PageFieldsFragment
  )> }
);

export type PageQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PageQuery = (
  { __typename?: 'Query' }
  & { page: (
    { __typename?: 'Page' }
    & PageFieldsFragment
  ) }
);

export type PageCreateMutationVariables = Exact<{
  input: PageCreateInput;
}>;


export type PageCreateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'pageCreate'>
);

export type PageUpdateMutationVariables = Exact<{
  input: PageUpdateInput;
}>;


export type PageUpdateMutation = (
  { __typename?: 'Mutation' }
  & { pageUpdate: (
    { __typename?: 'Page' }
    & Pick<Page, 'id'>
  ) }
);

export const PageFieldsFragmentDoc = gql`
    fragment PageFields on Page {
  id
  data
  width
  height
  createdBy {
    id
    avatar
    displayName
  }
  forkedFrom {
    id
  }
  upvotes
  tags
}
    `;
export const SearchPagesDocument = gql`
    query searchPages($searchTerm: String!, $before: String, $after: String) {
  searchPages(
    searchTerm: $searchTerm
    pagination: {before: $before, after: $after}
  ) {
    hasNext
    pages {
      ...PageFields
    }
  }
}
    ${PageFieldsFragmentDoc}`;

/**
 * __useSearchPagesQuery__
 *
 * To run a query within a React component, call `useSearchPagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPagesQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSearchPagesQuery(baseOptions: Apollo.QueryHookOptions<SearchPagesQuery, SearchPagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchPagesQuery, SearchPagesQueryVariables>(SearchPagesDocument, options);
      }
export function useSearchPagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchPagesQuery, SearchPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchPagesQuery, SearchPagesQueryVariables>(SearchPagesDocument, options);
        }
export type SearchPagesQueryHookResult = ReturnType<typeof useSearchPagesQuery>;
export type SearchPagesLazyQueryHookResult = ReturnType<typeof useSearchPagesLazyQuery>;
export type SearchPagesQueryResult = Apollo.QueryResult<SearchPagesQuery, SearchPagesQueryVariables>;
export const MeDocument = gql`
    query me {
  user {
    id
    avatar
    displayName
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MyPagesDocument = gql`
    query myPages {
  myPages {
    ...PageFields
  }
}
    ${PageFieldsFragmentDoc}`;

/**
 * __useMyPagesQuery__
 *
 * To run a query within a React component, call `useMyPagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyPagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyPagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyPagesQuery(baseOptions?: Apollo.QueryHookOptions<MyPagesQuery, MyPagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyPagesQuery, MyPagesQueryVariables>(MyPagesDocument, options);
      }
export function useMyPagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyPagesQuery, MyPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyPagesQuery, MyPagesQueryVariables>(MyPagesDocument, options);
        }
export type MyPagesQueryHookResult = ReturnType<typeof useMyPagesQuery>;
export type MyPagesLazyQueryHookResult = ReturnType<typeof useMyPagesLazyQuery>;
export type MyPagesQueryResult = Apollo.QueryResult<MyPagesQuery, MyPagesQueryVariables>;
export const PageDocument = gql`
    query page($id: String!) {
  page(id: $id) {
    ...PageFields
  }
}
    ${PageFieldsFragmentDoc}`;

/**
 * __usePageQuery__
 *
 * To run a query within a React component, call `usePageQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePageQuery(baseOptions: Apollo.QueryHookOptions<PageQuery, PageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PageQuery, PageQueryVariables>(PageDocument, options);
      }
export function usePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PageQuery, PageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PageQuery, PageQueryVariables>(PageDocument, options);
        }
export type PageQueryHookResult = ReturnType<typeof usePageQuery>;
export type PageLazyQueryHookResult = ReturnType<typeof usePageLazyQuery>;
export type PageQueryResult = Apollo.QueryResult<PageQuery, PageQueryVariables>;
export const PageCreateDocument = gql`
    mutation pageCreate($input: PageCreateInput!) {
  pageCreate(input: $input)
}
    `;
export type PageCreateMutationFn = Apollo.MutationFunction<PageCreateMutation, PageCreateMutationVariables>;

/**
 * __usePageCreateMutation__
 *
 * To run a mutation, you first call `usePageCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageCreateMutation, { data, loading, error }] = usePageCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePageCreateMutation(baseOptions?: Apollo.MutationHookOptions<PageCreateMutation, PageCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PageCreateMutation, PageCreateMutationVariables>(PageCreateDocument, options);
      }
export type PageCreateMutationHookResult = ReturnType<typeof usePageCreateMutation>;
export type PageCreateMutationResult = Apollo.MutationResult<PageCreateMutation>;
export type PageCreateMutationOptions = Apollo.BaseMutationOptions<PageCreateMutation, PageCreateMutationVariables>;
export const PageUpdateDocument = gql`
    mutation pageUpdate($input: PageUpdateInput!) {
  pageUpdate(input: $input) {
    id
  }
}
    `;
export type PageUpdateMutationFn = Apollo.MutationFunction<PageUpdateMutation, PageUpdateMutationVariables>;

/**
 * __usePageUpdateMutation__
 *
 * To run a mutation, you first call `usePageUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageUpdateMutation, { data, loading, error }] = usePageUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePageUpdateMutation(baseOptions?: Apollo.MutationHookOptions<PageUpdateMutation, PageUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PageUpdateMutation, PageUpdateMutationVariables>(PageUpdateDocument, options);
      }
export type PageUpdateMutationHookResult = ReturnType<typeof usePageUpdateMutation>;
export type PageUpdateMutationResult = Apollo.MutationResult<PageUpdateMutation>;
export type PageUpdateMutationOptions = Apollo.BaseMutationOptions<PageUpdateMutation, PageUpdateMutationVariables>;