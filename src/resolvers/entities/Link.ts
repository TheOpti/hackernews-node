import { Link } from '../../generated/graphql';
import { GraphQLContext } from '../../types';

export const postedBy = (parent: Link, _: {}, context: GraphQLContext) => {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).postedBy();
};

export const votes = (parent: Link, _: {}, context: GraphQLContext) => {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
};

export const numberOfComments = async (parent: Link) => {
  return parent?.comments?.length || 0;
};

export const numberOfVotes = async (parent: Link) => {
  return parent?.votes?.length || 0;
};

export const comments = (parent: Link, _: {}, context: GraphQLContext) => {
  return context.prisma.comment.findMany({
    where: {
      linkId: parent.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
