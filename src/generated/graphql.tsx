export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Upload: any;
  Uuid: any;
};


export type Mutation = {
  __typename?: 'Mutation';
  helloWorld: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  user: Maybe<User>;
};


export type QueryUserArgs = {
  id: Maybe<Scalars['String']>;
};


export type User = {
  __typename?: 'User';
  id: Scalars['Uuid'];
  displayName: Scalars['String'];
  avatar: Maybe<Scalars['String']>;
};

