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
  scoutingSessionSchema
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
        games: { schema: gameSchema },
        matches: { schema: matchSchema },
        scoutingSessions: { schema: scoutingSessionSchema }
      });

      await this.migrateLegacyPlayers(db);
      await this.migrateLegacyGames(db);

      return db;
    })();

    return this.dbPromise;
  }

  private async migrateLegacyGames(db: any) {
    const games = await db['games'].find().exec();
    for (const gameDocument of games) {
      const game = gameDocument.toJSON();
      const match = await db['matches'].findOne(game._id).exec();
      if (!match) {
        await db['matches'].insert({
          _id: game._id, name: game.name, dateTime: game.dateTime,
          homeTeamId: game.teamAId, awayTeamId: game.teamBId, tags: game.tags || [],
          status: game.status || 'PENDING', updatedAt: game.updatedAt || Date.now(), isDeleted: game.isDeleted ?? false
        });
      }
      const sessionId = `scout-${game._id}`;
      const session = await db['scoutingSessions'].findOne(sessionId).exec();
      if (!session) {
        await db['scoutingSessions'].insert({
          _id: sessionId, matchId: game._id, elapsedSeconds: 0,
          events: (game.events || []).map((event: any, index: number) => ({
            ...event, sequence: index + 1,
            type: event.type === 'MIN2' ? 'TWO_MINUTES' : event.type === 'YELLOW' ? 'YELLOW_CARD' : event.type
          })),
          updatedAt: game.updatedAt || Date.now(), isDeleted: game.isDeleted ?? false
        });
      }
    }
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
