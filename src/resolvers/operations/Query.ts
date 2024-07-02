import { Prisma } from '@prisma/client';
import { LinkOrderByInput, QueryFeedArgs } from '../../generated/graphql';
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
    orderBy: convertOrderBy(args.orderBy)
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
