import { linkTypedef } from './typedefs/link';
import { userTypedef } from './typedefs/user';
import { voteTypedef } from './typedefs/vote';
import { authPayloadTypedef } from './typedefs/authPayload';
import { subscriptionTypedef } from "./typedefs/subscription";

// GraphQL schema
const typeDefs = `
  type Query {
    info: String!
    feed(filter: String, skip: Int, take: Int): [Link!]!
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

    # Add vote
    vote(linkId: ID!): Vote
  }

  ${linkTypedef}

  ${userTypedef}

  ${voteTypedef}

  ${authPayloadTypedef}

  ${subscriptionTypedef}
`;

export default typeDefs;
