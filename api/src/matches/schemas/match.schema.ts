import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  dateTime?: string;

  @Prop({ required: true })
  homeTeamId: string;

  @Prop({ required: true })
  awayTeamId: string;

  @Prop([String])
  tags: string[];

  @Prop({ enum: ['PENDING', 'RUNNING', 'FINISHED'], default: 'PENDING' })
  status: 'PENDING' | 'RUNNING' | 'FINISHED';

  @Prop({ default: false })
  deleted: boolean;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
