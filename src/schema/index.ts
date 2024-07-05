import { authPayloadTypedef } from './typedefs/authPayload';
import { commentTypedef } from './typedefs/comment';
import { linkTypedef } from './typedefs/link';
import { meTypedef } from './typedefs/loggedUser';
import { subscriptionTypedef } from './typedefs/subscription';
import { userTypedef } from './typedefs/user';
import { voteTypedef } from './typedefs/vote';

const typeDefs = `
  scalar IntID
  scalar DateTime

  type Query {
    me: LoggedUser

    feed(filter: String, skip: Int, take: Int, orderBy: LinkOrderByInput): [Link!]!
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

    # Refresh token
    refreshToken(refreshToken: String!): AuthPayload
  }

  ${linkTypedef}
  
  ${userTypedef}

  ${meTypedef}
  
  ${commentTypedef}

  ${voteTypedef}

  ${authPayloadTypedef}

  ${subscriptionTypedef}

  input LinkOrderByInput {
    description: Sort
    url: Sort
    createdAt: Sort
  }

  enum Sort {
    asc
    desc
  }
`;

export default typeDefs;
