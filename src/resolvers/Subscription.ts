export const subscribeToNewLink = (parent: any, args: any, context: any) => {
  return context.pubsub.asyncIterator('NEW_LINK');
};

// subscription resolver is provided as the value for a subscribed field inside a plain JavaScript object.
export const newLink = {
  subscribe: subscribeToNewLink,
  resolve: (payload: any) => payload
};

export const subscribeToNewVote = (parent: any, args: any, context: any) => {
  return context.pubsub.asyncIterator('NEW_VOTE');
};

export const newVote = {
  subscribe: subscribeToNewVote,
  resolve: (payload: any) => payload
};
