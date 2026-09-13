import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../schemas/player.schema';

@Injectable()
export class PlayerRepository {
  constructor(@InjectModel(Player.name) private readonly model: Model<PlayerDocument>) {}

  findActive(): Promise<PlayerDocument[]> {
    return this.model.find({ deleted: false }).exec();
  }
  upsert(id: string, data: Record<string, unknown>): Promise<PlayerDocument> {
    return this.model.findByIdAndUpdate(id, data, { upsert: true, new: true }).exec() as Promise<PlayerDocument>;
  }
}
