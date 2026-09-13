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
  playerMembershipSchema,
  playerMigrationStrategies,
  playerSchema,
  teamSchema
} from './schemas';

@Injectable({
  providedIn: 'root'
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
      const storage = isDevMode()
        ? wrappedValidateAjvStorage({ storage: getRxStorageDexie() })
        : getRxStorageDexie();

      const db = await createRxDatabase({
        name: 'handball_scout_db',
        storage,
        ignoreDuplicate: true
      });

      await db.addCollections({
        teams: { schema: teamSchema },
        players: {
          schema: playerSchema,
          migrationStrategies: playerMigrationStrategies
        },
        playerMemberships: { schema: playerMembershipSchema },
        games: { schema: gameSchema }
      });

      await this.migrateLegacyPlayers(db);

      return db;
    })();

    return this.dbPromise;
  }

  private async migrateLegacyPlayers(db: any) {
    const legacyPlayers = await db['players'].find().exec();

    for (const player of legacyPlayers) {
      const playerData = player.toJSON();
      if (!playerData.legacyTeamId) continue;

      const membershipId = `legacy-${playerData._id}-${playerData.legacyTeamId}`;
      const existingMembership = await db['playerMemberships'].findOne(membershipId).exec();

      if (!existingMembership) {
        await db['playerMemberships'].insert({
          _id: membershipId,
          playerId: playerData._id,
          teamId: playerData.legacyTeamId,
          number: typeof playerData.legacyNumber === 'number' ? playerData.legacyNumber : 0,
          position: playerData.legacyPosition || 'Não definida',
          status: playerData.isDeleted ? 'INACTIVE' : 'ACTIVE',
          updatedAt: playerData.updatedAt || Date.now(),
          isDeleted: playerData.isDeleted ?? false
        });
      }

      await player.modify((data: any) => {
        delete data.legacyTeamId;
        delete data.legacyNumber;
        delete data.legacyPosition;
        return data;
      });
    }
  }
}
