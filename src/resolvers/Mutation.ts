import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { APP_SECRET } from '../utils';

export const signup = async (parent: any, args: any, context: any) => {
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

export const login = async (parent: any, args: any, context: any) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });

  if (!user) {
    console.log('User not found');
    throw new Error('Incorrect user or password.');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    console.log('Invalid password');
    throw new Error('Invalid password.');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

export const addLink = async (parent: any, args: any, context: any) => {
  console.log('inside addLink');
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } }
    }
  });

  context.pubsub.publish('NEW_LINK', newLink);

  return newLink;
};

export const updateLink = async (parent: any, args: any, context: any) => {
  console.log('inside updateLink');
  const { id, url, description } = args;
  const { userId } = context;

  try {
    const link = await context.prisma.link.findUnique({
      where: { id }
    });

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
    console.log('Error: ', err);
    return 'Could not update link with id: ' + id;
  }
};

export const deleteLink = async (parent: any, args: any, context: any) => {
  console.log('inside deleteLink');
  const { id } = args;
  const { userId } = context;

  try {
    const link = await context.prisma.link.findUnique({
      where: { id }
    });

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

export const vote = async (parent: any, args: any, context: any) => {
  const userId = context.userId;

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
