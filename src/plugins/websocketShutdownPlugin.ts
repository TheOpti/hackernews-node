import { Disposable } from 'graphql-ws';

export const getWebsocketShutdownPlugin = (serverCleanup: Disposable) => ({
  async serverWillStart() {
    return {
      async drainServer() {
        await serverCleanup.dispose();
      }
    };
  }
});
