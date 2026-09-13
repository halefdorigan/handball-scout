import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerMembership, PlayerMembershipDocument } from '../schemas/player-membership.schema';

@Injectable()
export class PlayerMembershipRepository {
  constructor(@InjectModel(PlayerMembership.name) private readonly model: Model<PlayerMembershipDocument>) {}

  findActive(): Promise<PlayerMembershipDocument[]> {
    return this.model.find({ deleted: false }).exec();
  }
  upsert(id: string, data: Record<string, unknown>): Promise<PlayerMembershipDocument> {
    return this.model
      .findByIdAndUpdate(id, data, { upsert: true, new: true })
      .exec() as Promise<PlayerMembershipDocument>;
  }
}
