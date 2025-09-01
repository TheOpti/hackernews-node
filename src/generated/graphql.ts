import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  IntID: { input: number; output: number };
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  author?: Maybe<User>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['IntID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Link = {
  __typename?: 'Link';
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['IntID']['output'];
  numberOfComments?: Maybe<Scalars['Int']['output']>;
  numberOfVotes?: Maybe<Scalars['Int']['output']>;
  postedBy?: Maybe<User>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  votes?: Maybe<Array<Vote>>;
};

export type LinkOrderByInput = {
  createdAt?: InputMaybe<Sort>;
  description?: InputMaybe<Sort>;
  url?: InputMaybe<Sort>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addLink: Link;
  deleteAllLinks?: Maybe<Scalars['String']['output']>;
  deleteLink?: Maybe<Scalars['String']['output']>;
  login?: Maybe<AuthPayload>;
  refreshToken?: Maybe<AuthPayload>;
  signup?: Maybe<AuthPayload>;
  updateLink?: Maybe<Scalars['String']['output']>;
  vote?: Maybe<Vote>;
};

export type MutationAddLinkArgs = {
  description: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type MutationDeleteLinkArgs = {
  id: Scalars['Int']['input'];
};

export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};

export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationUpdateLinkArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type MutationVoteArgs = {
  linkId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  feed: Array<Link>;
  user?: Maybe<User>;
};

export type QueryFeedArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<LinkOrderByInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryUserArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export type Subscription = {
  __typename?: 'Subscription';
  newLink?: Maybe<Link>;
  newVote?: Maybe<Vote>;
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['IntID']['output'];
  links?: Maybe<Array<Maybe<Link>>>;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  votes?: Maybe<Array<Maybe<Vote>>>;
};

export type Vote = {
  __typename?: 'Vote';
  id: Scalars['IntID']['output'];
  link?: Maybe<Link>;
  user?: Maybe<User>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Comment: ResolverTypeWrapper<Comment>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntID: ResolverTypeWrapper<Scalars['IntID']['output']>;
  Link: ResolverTypeWrapper<Link>;
  LinkOrderByInput: LinkOrderByInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Sort: Sort;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  Vote: ResolverTypeWrapper<Vote>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  Comment: Comment;
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  IntID: Scalars['IntID']['output'];
  Link: Link;
  LinkOrderByInput: LinkOrderByInput;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  User: User;
  Vote: Vote;
};

export type AuthPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']
> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']
> = {
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['IntID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface IntIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IntID'], any> {
  name: 'IntID';
}

export type LinkResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Link'] = ResolversParentTypes['Link']
> = {
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['IntID'], ParentType, ContextType>;
  numberOfComments?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  numberOfVotes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  postedBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  votes?: Resolver<Maybe<Array<ResolversTypes['Vote']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  addLink?: Resolver<
    ResolversTypes['Link'],
    ParentType,
    ContextType,
    RequireFields<MutationAddLinkArgs, 'description' | 'url'>
  >;
  deleteAllLinks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deleteLink?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteLinkArgs, 'id'>
  >;
  login?: Resolver<
    Maybe<ResolversTypes['AuthPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'email' | 'password'>
  >;
  refreshToken?: Resolver<
    Maybe<ResolversTypes['AuthPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationRefreshTokenArgs, 'refreshToken'>
  >;
  signup?: Resolver<
    Maybe<ResolversTypes['AuthPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationSignupArgs, 'email' | 'name' | 'password'>
  >;
  updateLink?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateLinkArgs, 'id'>
  >;
  vote?: Resolver<
    Maybe<ResolversTypes['Vote']>,
    ParentType,
    ContextType,
    RequireFields<MutationVoteArgs, 'linkId'>
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  feed?: Resolver<Array<ResolversTypes['Link']>, ParentType, ContextType, Partial<QueryFeedArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUserArgs>>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = {
  newLink?: SubscriptionResolver<Maybe<ResolversTypes['Link']>, 'newLink', ParentType, ContextType>;
  newVote?: SubscriptionResolver<Maybe<ResolversTypes['Vote']>, 'newVote', ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Comment']>>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['IntID'], ParentType, ContextType>;
  links?: Resolver<Maybe<Array<Maybe<ResolversTypes['Link']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  votes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Vote']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']
> = {
  id?: Resolver<ResolversTypes['IntID'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['Link']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  IntID?: GraphQLScalarType;
  Link?: LinkResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vote?: VoteResolvers<ContextType>;
};
