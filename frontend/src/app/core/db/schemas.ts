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
    deleted: { type: 'boolean' }
  },
  required: ['_id', 'name', 'updatedAt']
};

export const playerSchema: RxJsonSchema<any> = {
  title: 'player schema',
  version: 0,
  description: 'describes a handball player',
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: { type: 'string', maxLength: 100 },
    teamId: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    number: { type: 'number' },
    position: { type: 'string' },
    updatedAt: { type: 'number' },
    deleted: { type: 'boolean' }
  },
  required: ['_id', 'teamId', 'name', 'updatedAt'],
  indexes: ['teamId']
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
    deleted: { type: 'boolean' }
  },
  required: ['_id', 'name', 'updatedAt']
};
