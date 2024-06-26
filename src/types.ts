import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { PubSub } from 'graphql-subscriptions';

export type GraphQLContext = {
  prisma: PrismaClient;
  pubsub: PubSub;
  userId: string | null;
  req?: Request;
} & Record<string, unknown>;
