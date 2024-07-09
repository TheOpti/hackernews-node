import { author } from './entities/Comment';
import { postedBy, votes, comments, numberOfComments, numberOfVotes } from './entities/Link';
import { links } from './entities/User';
import { link as voteLink, user as voteUser } from './entities/Vote';
import {
  addLink,
  deleteLink,
  login,
  refreshToken,
  signup,
  updateLink,
  vote
} from './operations/Mutation';
import { feed, me } from './operations/Query';
import { newLink, newVote } from './operations/Subscription';
import { DateTime } from './scalars/datetime';
import { Resolvers } from '../generated/graphql';

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
    comments,
    numberOfComments,
    numberOfVotes
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
