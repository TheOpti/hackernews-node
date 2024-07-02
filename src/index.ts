import { createServer } from 'http';
import express, { Request } from 'express';
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

import { logger } from './logger';
import { getWebsocketShutdownPlugin } from './plugins/websocketShutdownPlugin';
import { signup, login, addLink, updateLink, deleteLink, vote } from './resolvers/Mutation';
import { author } from './resolvers/Comment';
import { postedBy, votes, comments } from './resolvers/Link';
import { feed } from './resolvers/Query';
import { links } from './resolvers/User';
import { link as voteLink, user as voteUser } from './resolvers/Vote';
import { newLink, newVote } from './resolvers/Subscription';
import typeDefs from './schema';
import { getUserId, getUserIdFromWebSocket } from './utils';
import { getLoggerPlugin } from './plugins/loggerPlugin';
import { Resolvers } from './generated/graphql';
import { GraphQLContext } from './types';
import { GraphQLScalarType, Kind } from 'graphql';

const prisma = new PrismaClient();

const pubsub = new PubSub();

// Actual implementation of the GraphQL schema
const resolvers: Resolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'ISO-8601 compliant DateTime type',
    parseValue(value) {
      return new Date(value as string); // value from the client input
    },
    serialize(value) {
      return (value as Date).toISOString(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value); // value from the client query
      }
      return null;
    }
  }),

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
    votes,
    comments
  },

  Comment: {
    author
  },

  User: {
    links
  },

  Vote: {
    link: voteLink,
    user: voteUser
  },

  Subscription: {
    newLink,
    newVote
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

// For HTTP requests
const httpContext = async ({ req }: { req: Request }): Promise<GraphQLContext> => ({
  prisma,
  pubsub,
  userId: req && req.headers.authorization ? getUserId(req) : undefined,
  req
});

// For WebSocket connections
const wsContext = async (connectionParams: any): Promise<GraphQLContext> => ({
  prisma,
  pubsub,
  userId: await getUserIdFromWebSocket(connectionParams)
  // Note: 'req' is not available here
});

const serverCleanup = useServer<GraphQLContext>({ schema, context: wsContext }, wsServer);

// Server
const server = new ApolloServer<GraphQLContext>({
  schema,

  plugins: [
    // GraphQL Playground
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault(),

    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    getWebsocketShutdownPlugin(serverCleanup),

    // Logging
    getLoggerPlugin()
  ]
});

// HTTP server is fully set up, actually listen.
httpServer.listen(4000, async () => {
  await server.start();

  app.use((req, _, next) => {
    logger.info('Incoming request: %s %s', req.method, req.url);
    next();
  });

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware<GraphQLContext>(server, {
      context: httpContext
    })
  );

  logger.info(`🚀 Query endpoint ready at http://localhost:4000/graphql`);
  logger.info(`🚀 Subscription endpoint ready at ws://localhost:4000/graphql`);
});
