import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';

import typeDefs from './definitions';
import links from './data';

// 2 actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
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

// 3 Server
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

