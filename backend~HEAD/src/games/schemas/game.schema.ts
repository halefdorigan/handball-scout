import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  dateTime: string;

  @Prop({ required: true })
  teamAId: string;

  @Prop({ required: true })
  teamBId: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop({ type: Array })
  events: any[];

  @Prop({ default: false })
  deleted: boolean;
}

export const GameSchema = SchemaFactory.createForClass(Game);
