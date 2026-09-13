import { Injectable } from '@nestjs/common';
import { Player, PlayerDocument } from './schemas/player.schema';
import { PlayerRepository } from './repositories/player.repository';

interface PlayerSyncData {
  _id: string;
  name: string;
  birthDate?: string;
  heightCm?: number;
  weightKg?: number;
  dominantHand?: 'RIGHT' | 'LEFT' | 'BOTH';
  updatedAt?: number | string;
  isDeleted?: boolean;
  deleted?: boolean;
  teamId?: string;
  number?: number;
  position?: string;
}

@Injectable()
export class PlayersService {
  constructor(private readonly players: PlayerRepository) {}

  async findAll(): Promise<PlayerDocument[]> {
    return this.players.findActive();
  }

  async upsert(playerData: PlayerSyncData): Promise<PlayerDocument> {
    const { _id, isDeleted, deleted, ...data } = playerData;
    const updateData: Record<string, unknown> = { ...data };
    delete updateData.teamId;
    delete updateData.number;
    delete updateData.position;

    if (typeof isDeleted === 'boolean') {
      updateData.deleted = isDeleted;
    } else if (typeof deleted === 'boolean') {
      updateData.deleted = deleted;
    }

    return this.players.upsert(_id, updateData);
  }

  async sync(players: PlayerSyncData[]): Promise<PlayerDocument[]> {
    const results: any[] = [];
    for (const player of players) {
      results.push(await this.upsert(player));
    }
    return results;
  }
}
