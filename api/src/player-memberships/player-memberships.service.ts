import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerMembership, PlayerMembershipDocument } from './schemas/player-membership.schema';

interface PlayerMembershipSyncData {
  _id: string;
  playerId: string;
  teamId: string;
  number?: number;
  position?: string;
  status: 'ACTIVE' | 'INACTIVE';
  updatedAt?: number | string;
  isDeleted?: boolean;
  deleted?: boolean;
}

@Injectable()
export class PlayerMembershipsService {
  constructor(@InjectModel(PlayerMembership.name) private membershipModel: Model<PlayerMembershipDocument>) {}

  async findAll(): Promise<PlayerMembershipDocument[]> {
    return this.membershipModel.find({ deleted: false }).exec();
  }

  async upsert(membershipData: PlayerMembershipSyncData): Promise<PlayerMembershipDocument> {
    const { _id, isDeleted, deleted, ...data } = membershipData;
    const updateData: Record<string, unknown> = { ...data };

    if (typeof isDeleted === 'boolean') {
      updateData.deleted = isDeleted;
    } else if (typeof deleted === 'boolean') {
      updateData.deleted = deleted;
    }

    return this.membershipModel
      .findByIdAndUpdate(_id, updateData, {
        upsert: true,
        new: true,
      })
      .exec() as Promise<PlayerMembershipDocument>;
  }

  async sync(memberships: PlayerMembershipSyncData[]): Promise<PlayerMembershipDocument[]> {
    const results: PlayerMembershipDocument[] = [];
    for (const membership of memberships) {
      results.push(await this.upsert(membership));
    }
    return results;
  }
}
