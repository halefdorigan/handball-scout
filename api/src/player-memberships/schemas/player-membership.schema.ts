import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerMembershipDocument = PlayerMembership & Document;

@Schema({ timestamps: true })
export class PlayerMembership {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  playerId: string;

  @Prop({ required: true })
  teamId: string;

  @Prop({ required: false, min: 0, max: 99 })
  number?: number;

  @Prop({ required: false })
  position?: string;

  @Prop({ required: true, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @Prop({ default: false })
  deleted: boolean;
}

export const PlayerMembershipSchema = SchemaFactory.createForClass(PlayerMembership);
