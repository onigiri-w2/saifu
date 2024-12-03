import { Migration } from 'kysely';

import { Migration20241025 } from './2024-10-25';

export const migrations: Record<string, Migration> = {
  '2024-10-25': Migration20241025,
};
