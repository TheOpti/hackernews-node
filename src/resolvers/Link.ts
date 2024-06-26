import { Link } from '../generated/graphql';
import { GraphQLContext } from '../types';

export const postedBy = (parent: Link, args: {}, context: GraphQLContext) => {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).postedBy();
};

export const votes = (parent: Link, args: {}, context: GraphQLContext) => {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
};
