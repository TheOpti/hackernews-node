import {
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors
} from '@apollo/server';
import { logger } from '../logger';

export const getLoggerPlugin = () => ({
  async requestDidStart(requestContext: GraphQLRequestContext<BaseContext>) {
    logger.info('Request started --- ');
    logger.info('origin: %o', requestContext.request.http?.headers?.get('origin'));
    logger.info('trace-id: %o', requestContext.request.http?.headers?.get('x-trace-id'));
    logger.info(
      'query: %o',
      (requestContext.request.http?.body as any).query?.replace(/\s+/g, ' ').trim()
    );
    logger.info('variables: %o', (requestContext.request.http?.body as any).variables);

    return {
      async didEncounterErrors(
        requestContext: GraphQLRequestContextDidEncounterErrors<BaseContext>
      ) {
        logger.error('GraphQL errors: %o', requestContext.errors);
      }
    };
  }
});
