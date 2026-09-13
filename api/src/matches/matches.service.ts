import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';

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
  constructor(@InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>) {}

  findAll(): Promise<MatchDocument[]> {
    return this.matchModel.find({ deleted: false }).exec();
  }

  async upsert(data: MatchSyncData): Promise<MatchDocument> {
    if (data.homeTeamId === data.awayTeamId) {
      throw new BadRequestException('Uma partida exige dois times distintos');
    }
    const { _id, isDeleted, deleted, ...match } = data;
    return this.matchModel.findByIdAndUpdate(
      _id,
      { ...match, deleted: isDeleted ?? deleted ?? false },
      { upsert: true, new: true },
    ).exec() as Promise<MatchDocument>;
  }

  async sync(matches: MatchSyncData[]): Promise<MatchDocument[]> {
    return Promise.all(matches.map((match) => this.upsert(match)));
  }
}
