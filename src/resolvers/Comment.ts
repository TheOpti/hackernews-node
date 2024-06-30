import { Comment } from '../generated/graphql';
import { GraphQLContext } from '../types';

export const author = (parent: Comment, _: {}, context: GraphQLContext) => {
  return context.prisma.user.findUnique({
    where: {
      id: parent.id
    }
  });
};
