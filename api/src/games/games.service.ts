import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';
import { Match, MatchDocument } from '../matches/schemas/match.schema';
import { ScoutingSession, ScoutingSessionDocument } from '../scouting/schemas/scouting-session.schema';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(Match.name) private matchModel?: Model<MatchDocument>,
    @InjectModel(ScoutingSession.name) private sessionModel?: Model<ScoutingSessionDocument>,
  ) {}

  async findAll(): Promise<GameDocument[]> {
    return this.gameModel.find({ deleted: false }).exec();
  }

  async upsert(gameData: any): Promise<GameDocument> {
    const { _id, ...updateData } = gameData;
    return this.gameModel
      .findByIdAndUpdate(_id, updateData, {
        upsert: true,
        new: true,
      })
      .exec() as Promise<GameDocument>;
  }

  async sync(games: any[]): Promise<any> {
    const results: any[] = [];
    for (const game of games) {
      results.push(await this.upsert(game));
      await this.migrateGame(game);
    }
    return results;
  }

  private async migrateGame(game: any): Promise<void> {
    if (!this.matchModel || !this.sessionModel) return;
    await this.matchModel.findByIdAndUpdate(game._id, {
      name: game.name, dateTime: game.dateTime, homeTeamId: game.teamAId,
      awayTeamId: game.teamBId, tags: game.tags || [], status: game.status || 'PENDING',
      deleted: game.isDeleted ?? game.deleted ?? false,
    }, { upsert: true, new: true }).exec();
    await this.sessionModel.findByIdAndUpdate(`scout-${game._id}`, {
      matchId: game._id, elapsedSeconds: 0,
      events: (game.events || []).map((event: any, index: number) => ({
        ...event, sequence: event.sequence || index + 1,
        type: event.type === 'MIN2' ? 'TWO_MINUTES' : event.type === 'YELLOW' ? 'YELLOW_CARD' : event.type,
      })),
      deleted: game.isDeleted ?? game.deleted ?? false,
    }, { upsert: true, new: true }).exec();
  }
}
