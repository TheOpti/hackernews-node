import { User } from '../../generated/graphql';
import { GraphQLContext } from '../../types';

export const links = (parent: User, _: {}, context: GraphQLContext) => {
  return context.prisma.link.findMany({
    where: { postedById: parent.id },
    include: {
      comments: true,
      votes: true
    }
  });
};
