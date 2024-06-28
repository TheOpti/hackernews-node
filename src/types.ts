import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { PubSub } from 'graphql-subscriptions';

export type GraphQLContext = {
  prisma: PrismaClient;
  pubsub: PubSub;
  userId?: number;
  req?: Request;
} & Record<string, unknown>;
