/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, isDevMode } from '@angular/core';
// @ts-ignore
import { createRxDatabase, RxDatabase, addRxPlugin } from 'rxdb';
// @ts-ignore
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
// @ts-ignore
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { teamSchema, playerSchema, gameSchema } from './schemas';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbPromise?: Promise<any>;

  constructor() {
    if (isDevMode()) {
      try {
        addRxPlugin(RxDBDevModePlugin);
      } catch (e) {}
    }
  }

  async getDb(): Promise<any> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = (async () => {
      const db = await createRxDatabase({
        name: 'handball_scout_db',
        storage: getRxStorageDexie(),
        ignoreDuplicate: true
      });

      await db.addCollections({
        teams: { schema: teamSchema },
        players: { schema: playerSchema },
        games: { schema: gameSchema }
      });

      return db;
    })();

    return this.dbPromise;
  }
}
