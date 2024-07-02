import { GraphQLScalarType, Kind } from 'graphql';

export const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO-8601 compliant DateTime type',
  parseValue(value) {
    return new Date(value as string);
  },
  serialize(value) {
    return (value as Date).toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
});
