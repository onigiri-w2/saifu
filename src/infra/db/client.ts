import { Kysely } from 'kysely';
import { ExpoDialect } from 'kysely-expo';

import { Database } from './schema';

export const db = new Kysely<Database>({
  dialect: new ExpoDialect({
    database: 'dev-11.db',
    // debug: true,
  }),
});
