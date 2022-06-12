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
    updateLink(id: ID!, url: String, description: String): String

    # Delete a link
    deleteLink(id: ID!): String
  }

  ${linkTypedef}
`;

export default typeDefs;
