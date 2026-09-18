/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, isDevMode } from '@angular/core';
// @ts-ignore
import { createRxDatabase, RxDatabase, addRxPlugin } from 'rxdb';
// @ts-ignore
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
// @ts-ignore
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
// @ts-ignore
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
// @ts-ignore
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import {
  gameSchema,
  matchSchema,
  playerMembershipSchema,
  playerMigrationStrategies,
  playerSchema,
  teamSchema,
  scoutingSessionSchema,
} from './schemas';
import { migrateLegacyData } from '../repositories/legacy-migration.repository';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private dbPromise?: Promise<any>;

  constructor() {
    addRxPlugin(RxDBMigrationSchemaPlugin);
    if (isDevMode()) {
      try {
        addRxPlugin(RxDBDevModePlugin);
      } catch (e) {}
    }
  }

  async getDb(): Promise<any> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = (async () => {
      const storage = isDevMode() ? wrappedValidateAjvStorage({ storage: getRxStorageDexie() }) : getRxStorageDexie();

      const db = await createRxDatabase({
        name: 'handball_scout_db',
        storage,
        ...(isDevMode() ? { ignoreDuplicate: true } : {}),
      });

      await db.addCollections({
        teams: { schema: teamSchema },
        players: {
          schema: playerSchema,
          migrationStrategies: playerMigrationStrategies,
        },
        playerMemberships: { schema: playerMembershipSchema },
        games: { schema: gameSchema },
        matches: { schema: matchSchema },
        scoutingSessions: { schema: scoutingSessionSchema },
      });

      await migrateLegacyData(db);

      return db;
    })();

    return this.dbPromise;
  }
}
