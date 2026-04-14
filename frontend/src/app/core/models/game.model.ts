export interface Game {
  _id: string;
  name: string;
  dateTime: string;
  teamAId: string;
  teamBId: string;
  tags: string[];
  status: 'PENDING' | 'RUNNING' | 'FINISHED';
  events: GameEvent[];
  updatedAt: number;
  deleted: boolean;
}

export interface GameEvent {
  id: string;
  type: string;
  playerId?: string;
  teamId: string;
  gameTime: number; // in seconds
  realTime: string;
}
