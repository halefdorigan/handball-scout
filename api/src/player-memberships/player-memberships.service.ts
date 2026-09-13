import { Injectable } from '@nestjs/common';
import { PlayerMembership, PlayerMembershipDocument } from './schemas/player-membership.schema';
import { PlayerMembershipRepository } from './repositories/player-membership.repository';

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
  constructor(private readonly memberships: PlayerMembershipRepository) {}

  async findAll(): Promise<PlayerMembershipDocument[]> {
    return this.memberships.findActive();
  }

  async upsert(membershipData: PlayerMembershipSyncData): Promise<PlayerMembershipDocument> {
    const { _id, isDeleted, deleted, ...data } = membershipData;
    const updateData: Record<string, unknown> = { ...data };

    if (typeof isDeleted === 'boolean') {
      updateData.deleted = isDeleted;
    } else if (typeof deleted === 'boolean') {
      updateData.deleted = deleted;
    }

    return this.memberships.upsert(_id, updateData);
  }

  async sync(memberships: PlayerMembershipSyncData[]): Promise<PlayerMembershipDocument[]> {
    const results: PlayerMembershipDocument[] = [];
    for (const membership of memberships) {
      results.push(await this.upsert(membership));
    }
    return results;
  }
}
