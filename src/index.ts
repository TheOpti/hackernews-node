import { createServer } from 'http';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import bodyParser from 'body-parser';
import cors from 'cors';

import { signup, login, addLink, updateLink, deleteLink, vote } from './resolvers/Mutation';
import { postedBy, votes } from './resolvers/Link';
import { feed } from './resolvers/Query';
import { links } from './resolvers/User';
import { link as voteLink, user as voteUser } from './resolvers/Vote';
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
    deleteLink,
    vote
  },

  Link: {
    postedBy,
    votes
  },

  User: {
    links
  },

  Vote: {
    link: voteLink,
    user: voteUser
  },

  Subscription: {
    newLink
  }
};

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
});

const context = ({ req }: any) => ({
  ...req,
  prisma,
  pubsub,
  userId: req && req.headers.authorization ? getUserId(req) : null
});

const serverCleanup = useServer({ schema, context }, wsServer);

// Server
const server = new ApolloServer({
  schema,
  plugins: [
    // GraphQL Playground
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault(),

    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        };
      }
    }
  ]
});

// HTTP server is fully set up, actually listen.
httpServer.listen(4000, async () => {
  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context
    })
  );

  console.log(`🚀 Query endpoint ready at http://localhost:4000/graphql`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:4000/graphql`);
});
