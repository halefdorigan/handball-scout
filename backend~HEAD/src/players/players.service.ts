import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';

@Injectable()
export class PlayersService {
  constructor(@InjectModel(Player.name) private playerModel: Model<PlayerDocument>) {}

  async findAll(): Promise<PlayerDocument[]> {
    return this.playerModel.find({ deleted: false }).exec();
  }

  async upsert(playerData: any): Promise<PlayerDocument> {
    const { _id, ...updateData } = playerData;
    return this.playerModel.findByIdAndUpdate(_id, updateData, {
      upsert: true,
      new: true
    }).exec() as Promise<PlayerDocument>;
  }

  async sync(players: any[]): Promise<any> {
    const results: any[] = [];
    for (const player of players) {
      results.push(await this.upsert(player));
    }
    return results;
  }
}
