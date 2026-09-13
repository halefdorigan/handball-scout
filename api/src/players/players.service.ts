import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';

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
  constructor(@InjectModel(Player.name) private playerModel: Model<PlayerDocument>) {}

  async findAll(): Promise<PlayerDocument[]> {
    return this.playerModel.find({ deleted: false }).exec();
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

    return this.playerModel
      .findByIdAndUpdate(_id, updateData, {
        upsert: true,
        new: true,
      })
      .exec() as Promise<PlayerDocument>;
  }

  async sync(players: PlayerSyncData[]): Promise<PlayerDocument[]> {
    const results: any[] = [];
    for (const player of players) {
      results.push(await this.upsert(player));
    }
    return results;
  }
}
