import type { Prisma } from '@prisma/client';

import { LinkOrderByInput, LoggedUser, QueryFeedArgs } from '../../generated/graphql';
import { GraphQLContext } from '../../types';

export const feed = async (_: {}, args: QueryFeedArgs, context: GraphQLContext) => {
  const where = args.filter
    ? {
        OR: [{ description: { contains: args.filter } }, { url: { contains: args.filter } }]
      }
    : {};

  return await context.prisma.link.findMany({
    where,
    skip: args.skip ?? undefined,
    take: args.take ?? undefined,
    orderBy: convertOrderBy(args.orderBy),
    include: {
      comments: true,
      votes: true
    }
  });
};

export const convertOrderBy = (
  orderBy: LinkOrderByInput | null | undefined
): Prisma.LinkOrderByWithRelationInput | undefined => {
  if (!orderBy) {
    return undefined;
  }

  const result: Prisma.LinkOrderByWithRelationInput = {};

  if (orderBy.createdAt) {
    result.createdAt = orderBy.createdAt.toLowerCase() as Prisma.SortOrder;
  }

  if (orderBy.description) {
    result.description = orderBy.description.toLowerCase() as Prisma.SortOrder;
  }

  if (orderBy.url) {
    result.url = orderBy.url.toLowerCase() as Prisma.SortOrder;
  }

  return result;
};

export const me = async (_: {}, __: {}, context: GraphQLContext) => {
  if (!context.userId) {
    return null;
  }

  const user = await context.prisma.user.findUnique({
    where: { id: context.userId },
    include: {
      profile: true
    }
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.profile?.bio
  } as LoggedUser;
};
