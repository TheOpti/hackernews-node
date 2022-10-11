import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { APP_SECRET } from '../utils';

export const signup = async (parent: any, args: any, context: any) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({ data: { ...args, password } });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export const login = async (parent: any, args: any, context: any) => {
  const user = await context.prisma.user.findUnique({ where: { email: args.email } });
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export const addLink = async (parent: any, args: any, context: any) => {
  console.log('inside addLink');
  const { userId } = context;

  return context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
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
      throw new Error('Cannot update this link.')
    }

    await context.prisma.link.update({
      where: { id },
      data: {
        ...(url ? { url } : {}),
        ...(description ? { description } : {}),
      },
    });

    return  'Link updated';
  } catch (err) {
    console.log('Error: ', err);
    return  'Could not update link with id: ' + id;
  }
}

export const deleteLink = async (parent: any, args: any, context: any) => {
  console.log('inside deleteLink');
  const { id } = args;
  const { userId } = context;

  try {
    const link = await context.prisma.link.findUnique({
      where: { id }
    });

    if (link.postedById !== userId) {
      throw new Error('Cannot delete this link.')
    }

    await context.prisma.link.delete({
      where: { id },
    });

    return  'Link deleted';
  } catch (_) {
    return  'Could not delete link with id: ' + id;
  }
}
