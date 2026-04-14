import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  color: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: false })
  deleted: boolean;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
