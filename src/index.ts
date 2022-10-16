import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { PubSub } from 'graphql-subscriptions';
import { PrismaClient } from '@prisma/client';

import { signup, login, addLink, updateLink, deleteLink } from './resolvers/Mutation';
import { postedBy } from './resolvers/Link';
import { feed } from './resolvers/Query';
import { links } from './resolvers/User';
import { newLink } from './resolvers/Subscription';

import { getUserId } from './utils';

import typeDefs from './schema';

const prisma = new PrismaClient();

const pubsub = new PubSub();

// Actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    feed
  },

  Mutation: {
    signup,
    login,
    addLink,
    updateLink,
    deleteLink
  },

  Link: {
    postedBy
  },

  User: {
    links
  },

  Subscription: {
    newLink,
  }
}

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    ...req,
    prisma,
    pubsub,
    userId:
      req && req.headers.authorization
        ? getUserId(req)
        : null
  }),
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
})

server
  .listen()
  .then(({ url }: any) =>
    console.log(`Server is running on ${url}`)
  );

