import { Injectable } from '@nestjs/common';
import { ScoutingSession, ScoutingSessionDocument } from './schemas/scouting-session.schema';
import { ScoutingSessionRepository } from './repositories/scouting-session.repository';

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
  constructor(private readonly sessions: ScoutingSessionRepository) {}

  findAll(): Promise<ScoutingSessionDocument[]> {
    return this.sessions.findActive();
  }

  async sync(data: ScoutingSessionSyncData[]): Promise<ScoutingSessionDocument[]> {
    return Promise.all(
      data.map(({ _id, isDeleted, deleted, ...session }) =>
        this.sessions.upsert(_id, {
          ...session,
          deleted: isDeleted ?? deleted ?? false,
        }),
      ),
    );
  }
}
