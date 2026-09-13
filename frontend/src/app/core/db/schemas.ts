/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import { RxJsonSchema } from 'rxdb';

export const teamSchema: RxJsonSchema<any> = {
  title: 'team schema',
  version: 0,
  description: 'describes a handball team',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    color: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    updatedAt: { type: 'number' },
    isDeleted: { type: 'boolean' }
  },
  required: ['_id', 'name', 'updatedAt']
};

export const playerSchema: RxJsonSchema<any> = {
  title: 'player schema',
  version: 1,
  description: 'describes a handball player',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    birthDate: { type: 'string' },
    heightCm: { type: 'number', minimum: 1 },
    weightKg: { type: 'number', minimum: 1 },
    dominantHand: { type: 'string', enum: ['RIGHT', 'LEFT', 'BOTH'] },
    legacyTeamId: { type: 'string', maxLength: 100 },
    legacyNumber: { type: 'number' },
    legacyPosition: { type: 'string' },
    updatedAt: { type: 'number' },
    isDeleted: { type: 'boolean' }
  },
  required: ['_id', 'name', 'updatedAt']
};

export const playerMigrationStrategies = {
  1: (oldDoc: any) => ({
    _id: oldDoc._id,
    name: oldDoc.name,
    ...(oldDoc.birthDate ? { birthDate: oldDoc.birthDate } : {}),
    ...(typeof oldDoc.heightCm === 'number' ? { heightCm: oldDoc.heightCm } : {}),
    ...(typeof oldDoc.weightKg === 'number' ? { weightKg: oldDoc.weightKg } : {}),
    ...(oldDoc.dominantHand ? { dominantHand: oldDoc.dominantHand } : {}),
    ...(oldDoc.teamId ? { legacyTeamId: oldDoc.teamId } : {}),
    ...(typeof oldDoc.number === 'number' ? { legacyNumber: oldDoc.number } : {}),
    ...(oldDoc.position ? { legacyPosition: oldDoc.position } : {}),
    updatedAt: typeof oldDoc.updatedAt === 'number' ? oldDoc.updatedAt : Date.now(),
    isDeleted: oldDoc.isDeleted ?? false
  })
};

export const playerMembershipSchema: RxJsonSchema<any> = {
  title: 'player membership schema',
  version: 0,
  description: 'describes a player relationship with a handball team',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 300 },
    playerId: { type: 'string', maxLength: 100 },
    teamId: { type: 'string', maxLength: 100 },
    number: { type: 'number', minimum: 0 },
    position: { type: 'string' },
    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
    updatedAt: { type: 'number' },
    isDeleted: { type: 'boolean' }
  },
  required: ['_id', 'playerId', 'teamId', 'status', 'updatedAt'],
  indexes: ['playerId', 'teamId']
};

export const gameSchema: RxJsonSchema<any> = {
  title: 'game schema',
  version: 0,
  description: 'describes a handball game/scout session',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    dateTime: { type: 'string' },
    teamAId: { type: 'string' },
    teamBId: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    status: { type: 'string' },
    events: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          playerId: { type: 'string' },
          teamId: { type: 'string' },
          gameTime: { type: 'number' },
          realTime: { type: 'string' }
        }
      }
    },
    updatedAt: { type: 'number' },
    isDeleted: { type: 'boolean' }
  },
  required: ['_id', 'name', 'updatedAt']
};

export const matchSchema: RxJsonSchema<any> = {
  title: 'match schema', version: 0, description: 'match metadata without scout events',
  primaryKey: '_id', type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 }, name: { type: 'string' }, dateTime: { type: 'string' },
    homeTeamId: { type: 'string', maxLength: 100 }, awayTeamId: { type: 'string', maxLength: 100 },
    tags: { type: 'array', items: { type: 'string' } }, status: { type: 'string', enum: ['PENDING', 'RUNNING', 'FINISHED'] },
    updatedAt: { type: 'number' }, isDeleted: { type: 'boolean' }
  },
  required: ['_id', 'name', 'homeTeamId', 'awayTeamId', 'status', 'updatedAt']
};

export const scoutingSessionSchema: RxJsonSchema<any> = {
  title: 'scouting session schema', version: 0, description: 'events registered for one match',
  primaryKey: '_id', type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 160 }, matchId: { type: 'string', maxLength: 100 },
    elapsedSeconds: { type: 'number', minimum: 0 }, events: { type: 'array', items: { type: 'object' } },
    updatedAt: { type: 'number' }, isDeleted: { type: 'boolean' }
  },
  required: ['_id', 'matchId', 'elapsedSeconds', 'events', 'updatedAt']
};
