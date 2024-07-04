import { Resolvers } from '../generated/graphql';
import { author } from './entities/Comment';
import { postedBy, votes, comments } from './entities/Link';
import { links } from './entities/User';
import {
  addLink,
  deleteLink,
  login,
  refreshToken,
  signup,
  updateLink,
  vote
} from './operations/Mutation';
import { link as voteLink, user as voteUser } from './entities/Vote';
import { feed, me } from './operations/Query';
import { newLink, newVote } from './operations/Subscription';
import { DateTime } from './scalars/datetime';

export const resolvers: Resolvers = {
  DateTime,

  Query: {
    feed,
    me
  },

  Mutation: {
    signup,
    login,
    addLink,
    updateLink,
    deleteLink,
    vote,
    refreshToken
  },

  Link: {
    postedBy,
    votes,
    comments
  },

  Comment: {
    author
  },

  User: {
    links
  },

  Vote: {
    link: voteLink,
    user: voteUser
  },

  Subscription: {
    newLink,
    newVote
  }
};
