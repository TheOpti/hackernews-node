import { Vote } from '../../generated/graphql';
import { GraphQLContext } from '../../types';

export const link = (parent: Vote, _: any, context: GraphQLContext) => {
  return context.prisma.vote.findUnique({ where: { id: parent.id } }).link();
};

export const user = (parent: Vote, _: any, context: GraphQLContext) => {
  return context.prisma.vote.findUnique({ where: { id: parent.id } }).user();
};
