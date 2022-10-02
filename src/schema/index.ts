import { linkTypedef } from './typedefs/link';

// GraphQL schema
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    # Create a link
    addLink(url: String!, description: String!): Link!

    # Update a link
    updateLink(id: Int!, url: String, description: String): String

    # Delete a link
    deleteLink(id: Int!): String

    # Delete all links
    deleteAllLinks: String
  }

  ${linkTypedef}
`;

export default typeDefs;
