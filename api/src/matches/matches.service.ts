import { BadRequestException, Injectable } from '@nestjs/common';
import { Match, MatchDocument } from './schemas/match.schema';
import { MatchRepository } from './repositories/match.repository';

export interface MatchSyncData {
  _id: string;
  name: string;
  dateTime?: string;
  homeTeamId: string;
  awayTeamId: string;
  tags?: string[];
  status?: 'PENDING' | 'RUNNING' | 'FINISHED';
  isDeleted?: boolean;
  deleted?: boolean;
}

@Injectable()
export class MatchesService {
  constructor(private readonly matches: MatchRepository) {}

  findAll(): Promise<MatchDocument[]> {
    return this.matches.findActive();
  }

  async upsert(data: MatchSyncData): Promise<MatchDocument> {
    if (data.homeTeamId === data.awayTeamId) {
      throw new BadRequestException('Uma partida exige dois times distintos');
    }
    const { _id, isDeleted, deleted, ...match } = data;
    return this.matches.upsert(_id, { ...match, deleted: isDeleted ?? deleted ?? false });
  }

  async sync(matches: MatchSyncData[]): Promise<MatchDocument[]> {
    return Promise.all(matches.map((match) => this.upsert(match)));
  }
}
