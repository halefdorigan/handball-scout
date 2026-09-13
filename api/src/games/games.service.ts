import { Injectable } from '@nestjs/common';
import { Game, GameDocument } from './schemas/game.schema';
import { GameRepository } from './repositories/game.repository';
import { MatchRepository } from '../matches/repositories/match.repository';
import { ScoutingSessionRepository } from '../scouting/repositories/scouting-session.repository';

@Injectable()
export class GamesService {
  constructor(
    private readonly games: GameRepository,
    private readonly matches: MatchRepository,
    private readonly sessions: ScoutingSessionRepository,
  ) {}

  async findAll(): Promise<GameDocument[]> {
    return this.games.findActive();
  }

  async upsert(gameData: any): Promise<GameDocument> {
    const { _id, ...updateData } = gameData;
    return this.games.upsert(_id, updateData);
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
    await this.matches.upsert(game._id, {
      name: game.name,
      dateTime: game.dateTime,
      homeTeamId: game.teamAId,
      awayTeamId: game.teamBId,
      tags: game.tags || [],
      status: game.status || 'PENDING',
      deleted: game.isDeleted ?? game.deleted ?? false,
    });
    await this.sessions.upsert(`scout-${game._id}`, {
      matchId: game._id,
      elapsedSeconds: 0,
      events: (game.events || []).map((event: any, index: number) => ({
        ...event,
        sequence: event.sequence || index + 1,
        type: event.type === 'MIN2' ? 'TWO_MINUTES' : event.type === 'YELLOW' ? 'YELLOW_CARD' : event.type,
      })),
      deleted: game.isDeleted ?? game.deleted ?? false,
    });
  }
}
