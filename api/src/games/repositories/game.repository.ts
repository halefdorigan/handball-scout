import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../schemas/game.schema';

@Injectable()
export class GameRepository {
  constructor(@InjectModel(Game.name) private readonly model: Model<GameDocument>) {}

  findActive(): Promise<GameDocument[]> {
    return this.model.find({ deleted: false }).exec();
  }
  upsert(id: string, data: Record<string, unknown>): Promise<GameDocument> {
    return this.model.findByIdAndUpdate(id, data, { upsert: true, new: true }).exec() as Promise<GameDocument>;
  }
}
