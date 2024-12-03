import { Migrator } from 'kysely';
import { ExpoMigrationProvider } from 'kysely-expo';

import { db } from './client';
import { migrations } from './migrations';

export const migrator = new Migrator({
  db,
  provider: new ExpoMigrationProvider({
    migrations,
  }),
});
