import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async findAll(): Promise<GameDocument[]> {
    return this.gameModel.find({ deleted: false }).exec();
  }

  async upsert(gameData: any): Promise<GameDocument> {
    const { _id, ...updateData } = gameData;
    return this.gameModel.findByIdAndUpdate(_id, updateData, {
      upsert: true,
      new: true
    }).exec() as Promise<GameDocument>;
  }

  async sync(games: any[]): Promise<any> {
    const results: any[] = [];
    for (const game of games) {
      results.push(await this.upsert(game));
    }
    return results;
  }
}
