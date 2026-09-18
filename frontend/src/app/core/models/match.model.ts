export type MatchStatus = 'PENDING' | 'RUNNING' | 'FINISHED';

export interface Match {
  _id: string;
  name: string;
  dateTime?: string;
  homeTeamId: string;
  awayTeamId: string;
  tags: string[];
  status: MatchStatus;
  updatedAt: number;
  isDeleted: boolean;
}

export type ScoutAction = 'GOAL' | 'MISS' | 'SAVE' | 'YELLOW_CARD' | 'TWO_MINUTES';

export interface ScoutEvent {
  id: string;
  sequence: number;
  type: ScoutAction;
  teamId: string;
  playerId?: string;
  gameTime: number;
  realTime: string;
}

export interface ScoutingSession {
  _id: string;
  matchId: string;
  elapsedSeconds: number;
  events: ScoutEvent[];
  updatedAt: number;
  isDeleted: boolean;
}
