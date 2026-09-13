import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  birthDate?: string;

  @Prop({ min: 1 })
  heightCm?: number;

  @Prop({ min: 1 })
  weightKg?: number;

  @Prop({ enum: ['RIGHT', 'LEFT', 'BOTH'] })
  dominantHand?: 'RIGHT' | 'LEFT' | 'BOTH';

  @Prop({ default: false })
  deleted: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
