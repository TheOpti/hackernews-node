import bcrypt from 'bcryptjs';
import { GraphQLContext } from '../../types';

import {
  MutationAddLinkArgs,
  MutationDeleteLinkArgs,
  MutationLoginArgs,
  MutationRefreshTokenArgs,
  MutationSignupArgs,
  MutationUpdateLinkArgs,
  MutationVoteArgs
} from '../../generated/graphql';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../../utils/jwt';

export const signup = async (_: {}, args: MutationSignupArgs, context: GraphQLContext) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password }
  });

  // TODO Rethink registration what tokens should be returned
  return {
    accessToken: createAccessToken(user.id),
    refreshToken: '',
    username: user.name
  };
};

export const login = async (_: {}, args: MutationLoginArgs, context: GraphQLContext) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });

  if (!user) {
    throw new Error('Incorrect user or password.');
  }

  // TODO encrypt password in DB and here
  const valid = args.password === user.password;
  if (!valid) {
    throw new Error('Invalid password.');
  }

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    username: user.name
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

export const refreshToken = (_: {}, args: MutationRefreshTokenArgs, context: GraphQLContext) => {
  const { refreshToken } = args;

  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  try {
    const { userId }: any = verifyRefreshToken(refreshToken);

    // TODO: Verify if the refresh token exists in the database
    // Store new refresh token in database
    // Invalidate old refresh token (immediately or after a short grace period)

    const newAccessToken = createAccessToken(userId);
    const newRefreshToken = createRefreshToken(userId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      username: ''
    };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
