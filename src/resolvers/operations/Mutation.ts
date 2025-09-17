import bcryptjs from 'bcryptjs';
import validator from 'validator';

import {
  MutationAddLinkArgs,
  MutationDeleteLinkArgs,
  MutationLoginArgs,
  MutationRefreshTokenArgs,
  MutationSignupArgs,
  MutationUpdateLinkArgs,
  MutationVoteArgs
} from '../../generated/graphql';
import { GraphQLContext } from '../../types';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../../utils/jwt';

export const signup = async (_: {}, args: MutationSignupArgs, context: GraphQLContext) => {
  if (!args.name || !args.email || !args.password) {
    throw new Error('Name, email, and password are required.');
  }

  if (!validator.isEmail(args.email)) {
    throw new Error('Invalid email format.');
  }

  if (!validator.isStrongPassword(args.password, { minLength: 8 })) {
    throw new Error('Password must be at least 8 characters and strong.');
  }

  const existingUser = await context.prisma.user.findUnique({
    where: { email: args.email }
  });

  if (existingUser) {
    throw new Error('Email already in use.');
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(args.password, salt);
  const newUser = await context.prisma.user.create({
    data: { ...args, password: hashedPassword, salt, refreshToken: '' }
  });

  // Registration flow: Only return access/refresh tokens if email confirmation is not required
  // If you require email confirmation, return a message instead and send confirmation email
  // return { message: 'Registration successful. Please confirm your email.' };
  const refreshToken = createRefreshToken(newUser.id);
  await context.prisma.user.update({
    where: { id: newUser.id },
    data: { refreshToken: refreshToken }
  });

  return {
    accessToken: createAccessToken(newUser.id),
    refreshToken,
    username: newUser.name
  };
};

export const login = async (_: {}, args: MutationLoginArgs, context: GraphQLContext) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });

  if (!user) {
    throw new Error('Incorrect user or password.');
  }

  const { password, salt } = user;
  const hashedProvidedPassword = await bcryptjs.hash(args.password, salt);

  if (hashedProvidedPassword !== password) {
    throw new Error('Invalid password.');
  }

  const newRefreshToken = createRefreshToken(user.id);
  await context.prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken }
  });

  return {
    accessToken: createAccessToken(user.id),
    refreshToken: newRefreshToken,
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

  if (vote) {
    throw new Error('Already voted for link');
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

export const refreshToken = async (
  _: {},
  args: MutationRefreshTokenArgs,
  context: GraphQLContext
) => {
  const { refreshToken } = args;

  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }

  try {
    const { userId: id }: any = verifyRefreshToken(refreshToken);

    // Only allow refresh if the token matches the one stored in DB
    const user = await context.prisma.user.findFirst({
      where: {
        id,
        refreshToken
      },
      select: { email: true }
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    // Issue new refresh token and store it (rotating any previous value)
    const newAccessToken = createAccessToken(id);
    const newRefreshToken = createRefreshToken(id);

    await context.prisma.user.update({
      where: { id },
      data: { refreshToken: newRefreshToken }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      username: ''
    };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
