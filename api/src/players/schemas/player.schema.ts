import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  teamId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  number: number;

  @Prop()
  position: string;

  @Prop({ default: false })
  deleted: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
