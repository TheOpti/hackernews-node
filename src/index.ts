import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';

import typeDefs from './schema';
import { links, removeLink, updateLink } from './data';

// Actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },

  Mutation: {
    addLink: (parent: any, args: any) => {
      console.log('Mutation -> addLink, args: ', args);
      const link = {
        id: `link-${links.length + 1}`,
        description: args.description,
        url: args.url,
      }

      links.push(link)
      return link;
    },
    updateLink: (parent: any, args: any) => {
      console.log('Mutation -> updateLink, args: ', args);
      const { id, url, description } = args;

      if (!links.find(({id: linkId }) => linkId === id)) {
        return 'Could not find element to update.';
      }

      updateLink(id, url, description);
      return  'Link updated';
    },
    deleteLink: (parent: any, args: any) => {
      console.log('Mutation -> deleteLink, args: ', args);
      const { id } = args;

      if (!links.find(({id: linkId }) => linkId === id)) {
        return 'Could not find element to delete.';
      }

      removeLink(id);

      return 'Link removed';
    },
  },

  // This resolver can be omitted
  Link: {
    id: (parent: any) => {
      console.log('Link -> id: ', parent.id);
      return parent.id;
    },
    description: (parent: any) => {
      console.log('Link -> description: ', parent.description);
      return parent.description;
    },
    url: (parent: any) => {
      console.log('Link -> url: ', parent.url);
      return parent.url;
    },
  }
}

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
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

