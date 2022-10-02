import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { PrismaClient } from '@prisma/client';

import typeDefs from './schema';

const prisma = new PrismaClient();

// Actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent: any, args: any, context: any) => {
      console.log('inside feed');
      return context.prisma.link.findMany();
    },
  },

  Mutation: {
    addLink: (parent: any, args: any, context: any) => {
      console.log('inside addLink');
      return context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
    },

    updateLink: async (parent: any, args: any, context: any) => {
      console.log('inside updateLink');
      const { id, url, description } = args;

      try {
        await context.prisma.link.update({
          where: { id },
          data: {
            ...(url ? { url } : {}),
            ...(description ? { description } : {}),
          },
        });

        return  'Link updated';
      } catch (_) {
        return  'Could not update link with id: ' + id;
      }
    },

    deleteLink: async (parent: any, args: any, context: any) => {
      console.log('inside deleteLink');
      const { id } = args;

      try {
        await  context.prisma.link.delete({
          where: { id },
        });

        return  'Link deleted';
      } catch (_) {
        return  'Could not delete link with id: ' + id;
      }
    },

    deleteAllLinks: (parent: any, args: any, context: any) => {
      console.log('inside deleteAllLinks');
      try {
        prisma.link.deleteMany({})
        return 'All links removed';
      } catch (_) {
        console.log('Error during deleting all links');
        return 'Could not delete all links.'
      }
    }
  },

  // This resolver can be omitted
  Link: {
    id: (parent: any) => {
      return parent.id;
    },
    description: (parent: any) => {
      return parent.description;
    },
    url: (parent: any) => {
      return parent.url;
    },
  }
}

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
})

server
  .listen()
  .then(({ url }: any) =>
    console.log(`Server is running on ${url}`)
  );

