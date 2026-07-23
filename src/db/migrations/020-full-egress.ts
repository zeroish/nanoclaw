import type Database from 'better-sqlite3';
import type { Migration } from './index.js';

export const migration020: Migration = {
  version: 20,
  name: 'full-egress',
  up(db: Database.Database) {
    db.prepare('ALTER TABLE container_configs ADD COLUMN full_egress INTEGER NOT NULL DEFAULT 0').run();
  },
};
