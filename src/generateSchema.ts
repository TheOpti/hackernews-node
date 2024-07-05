import fs from 'fs';

import typeDefs from './schema/index';

fs.writeFileSync('./src/generated/schema.graphql', typeDefs);
console.log('Schema saved successfully.');
