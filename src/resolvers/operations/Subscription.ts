import { PubSub } from 'graphql-subscriptions';
import { GraphQLContext } from '../../types';

export const subscribeToNewLink = (_: {}, __: {}, context: GraphQLContext) => {
  return context.pubsub.asyncIterator('NEW_LINK') as unknown as AsyncIterable<any>;
};

// subscription resolver is provided as the value for a subscribed field inside a plain JavaScript object.
export const newLink = {
  subscribe: subscribeToNewLink,
  resolve: (payload: any) => payload
};

export const subscribeToNewVote = (_: {}, __: {}, context: GraphQLContext) => {
  return (context.pubsub as PubSub).asyncIterator('NEW_VOTE') as unknown as AsyncIterable<any>;
};

export const newVote = {
  subscribe: subscribeToNewVote,
  resolve: (payload: any) => payload
};
