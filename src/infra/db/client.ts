import { Kysely } from 'kysely';
import { ExpoDialect } from 'kysely-expo';

import { Schema } from './schema';

export const db = new Kysely<Schema>({
  dialect: new ExpoDialect({
    database: 'dev-13.db',
  }),
});
