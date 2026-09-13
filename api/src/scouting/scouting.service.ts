import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScoutingSession, ScoutingSessionDocument } from './schemas/scouting-session.schema';

export interface ScoutingSessionSyncData {
  _id: string;
  matchId: string;
  elapsedSeconds?: number;
  events?: unknown[];
  isDeleted?: boolean;
  deleted?: boolean;
}

@Injectable()
export class ScoutingService {
  constructor(@InjectModel(ScoutingSession.name) private readonly sessions: Model<ScoutingSessionDocument>) {}

  findAll(): Promise<ScoutingSessionDocument[]> { return this.sessions.find({ deleted: false }).exec(); }

  async sync(data: ScoutingSessionSyncData[]): Promise<ScoutingSessionDocument[]> {
    return Promise.all(data.map(({ _id, isDeleted, deleted, ...session }) =>
      this.sessions.findByIdAndUpdate(_id, { ...session, deleted: isDeleted ?? deleted ?? false }, { upsert: true, new: true }).exec() as Promise<ScoutingSessionDocument>
    ));
  }
}
