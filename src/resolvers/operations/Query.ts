import type { Prisma } from '@prisma/client';

import { LinkOrderByInput, QueryFeedArgs, User } from '../../generated/graphql';
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

export const user = async (_: {}, args: { id?: string | null }, context: GraphQLContext) => {
  if (!args.id) {
    return null;
  }

  const userId = parseInt(args.id);

  const user = await context.prisma.user.findUnique({
    where: { id: userId },
    select: {
      password: false,
      salt: false,
      refreshToken: false,
      createdAt: true,
      updatedAt: false,
      id: true,
      name: true,
      profile: true,
      comments: true,
      votes: true,
      email: context.userId === userId
    }
  });

  return {
    ...user,
    bio: user!.profile?.bio ?? ''
  } as User;
};
