import { linkTypedef } from './typedefs/link';
import { userTypedef } from './typedefs/user';
import { authPayloadTypedef } from './typedefs/authPayload';

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

    # Register new user
    signup(email: String!, password: String!, name: String!): AuthPayload

    # Login into the application
    login(email: String!, password: String!): AuthPayload
  }

  ${linkTypedef}

  ${userTypedef}

  ${authPayloadTypedef}
`;

export default typeDefs;
