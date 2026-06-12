import { PGlite } from '@electric-sql/pglite';
import { drizzle, type PgliteDatabase } from 'drizzle-orm/pglite';

import * as schema from './schema';

/**
 * The Drizzle client type, which is a wrapper around the PGlite database instance.
 */
export type DrizzleClient = PgliteDatabase<typeof schema>;

/**
 * Where PGlite stores its data.
 * - `idb://<name>`       All browsers, persisted to IndexedDB.
 * - `opfs-ahp://<path>`  Chrome/Firefox Web Workers only, persisted to OPFS.
 * - `memory://`          All environments, ephemeral; for debugging and tests.
 *
 * @see https://pglite.dev/docs/filesystems
 */
export type DataDirectory = `idb://${string}` | `opfs-ahp://${string}` | 'memory://';

/** Creates a Drizzle client backed by a PGlite database at `dataDir`. */
export function createClient(dataDir: DataDirectory): DrizzleClient {
  const client = new PGlite(dataDir);
  return drizzle({ client, schema });
}
