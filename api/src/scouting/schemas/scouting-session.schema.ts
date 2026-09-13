import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

export type ScoutingSessionDocument = ScoutingSession & Document;

@Schema({ timestamps: true })
export class ScoutingSession {
  @Prop({ type: String, required: true, unique: true })
  matchId: string;

  @Prop({ default: 0 })
  elapsedSeconds: number;

  @Prop({ type: Array, default: [] })
  events: ScoutEvent[];

  @Prop({ default: false })
  deleted: boolean;
}

export const ScoutingSessionSchema = SchemaFactory.createForClass(ScoutingSession);
