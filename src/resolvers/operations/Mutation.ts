import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GraphQLContext } from '../../types';

import { APP_SECRET } from '../../utils';
import {
  MutationAddLinkArgs,
  MutationDeleteLinkArgs,
  MutationLoginArgs,
  MutationSignupArgs,
  MutationUpdateLinkArgs,
  MutationVoteArgs
} from '../../generated/graphql';

export const signup = async (_: {}, args: MutationSignupArgs, context: GraphQLContext) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password }
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

export const login = async (_: {}, args: MutationLoginArgs, context: GraphQLContext) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });

  if (!user) {
    throw new Error('Incorrect user or password.');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password.');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

export const addLink = async (_: {}, args: MutationAddLinkArgs, context: GraphQLContext) => {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      title: args.description,
      description: args.description,
      postedBy: { connect: { id: userId } }
    }
  });

  context.pubsub.publish('NEW_LINK', newLink);

  return newLink;
};

export const updateLink = async (_: {}, args: MutationUpdateLinkArgs, context: GraphQLContext) => {
  const { id, url, description } = args;
  const { userId } = context;

  try {
    const link = await context.prisma.link.findUnique({
      where: { id }
    });

    if (!link) {
      throw new Error('Did not find any link to update.');
    }

    if (link.postedById !== userId) {
      throw new Error('Cannot update this link.');
    }

    await context.prisma.link.update({
      where: { id },
      data: {
        ...(url ? { url } : {}),
        ...(description ? { description } : {})
      }
    });

    return 'Link updated';
  } catch (err) {
    return 'Could not update link with id: ' + id;
  }
};

export const deleteLink = async (
  parent: {},
  args: MutationDeleteLinkArgs,
  context: GraphQLContext
) => {
  const { id } = args;
  const { userId } = context;

  try {
    const link = await context.prisma.link.findUnique({
      where: { id }
    });

    if (!link) {
      throw new Error('Did not find any link to delete.');
    }

    if (link.postedById !== userId) {
      throw new Error('Cannot delete this link.');
    }

    await context.prisma.link.delete({
      where: { id }
    });

    return 'Link deleted';
  } catch (_) {
    return 'Could not delete link with id: ' + id;
  }
};

export const vote = async (_: {}, args: MutationVoteArgs, context: GraphQLContext) => {
  const userId = context.userId;

  if (!userId) {
    throw new Error('Did not find any user to add vote.');
  }

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId
      }
    }
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } }
    }
  });

  context.pubsub.publish('NEW_VOTE', newVote);

  return newVote;
};
