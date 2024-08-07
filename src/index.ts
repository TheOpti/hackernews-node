import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from '@apollo/server/plugin/landingPage/default';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request } from 'express';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import 'dotenv/config';

import { logger } from './logger';
import { getLoggerPlugin } from './plugins/loggerPlugin';
import { getWebsocketShutdownPlugin } from './plugins/websocketShutdownPlugin';
import { resolvers } from './resolvers';
import typeDefs from './schema';
import { GraphQLContext } from './types';
import { getUserId } from './utils/jwt';

const prisma = new PrismaClient();

const pubsub = new PubSub();

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
const wsContext = async (): Promise<GraphQLContext> => ({
  prisma,
  pubsub,
  // TODO Implement getting user id for WebSockets
  userId: 0
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
