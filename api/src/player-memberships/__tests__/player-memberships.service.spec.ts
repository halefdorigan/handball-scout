import { PlayerMembershipDocument } from '../schemas/player-membership.schema';
import { PlayerMembershipsService } from '../player-memberships.service';
import { PlayerMembershipRepository } from '../repositories/player-membership.repository';

describe('PlayerMembershipsService', () => {
  let membershipsService: PlayerMembershipsService;
  let memberships: {
    findActive: jest.Mock;
    upsert: jest.Mock;
  };

  beforeEach(() => {
    memberships = {
      findActive: jest.fn(),
      upsert: jest.fn(),
    };
    membershipsService = new PlayerMembershipsService(memberships as unknown as PlayerMembershipRepository);
  });

  describe('findAll', () => {
    it('should return non-deleted memberships', async () => {
      // Arrange
      const membershipDocuments = [{ _id: 'membership-id', playerId: 'player-id' }];
      memberships.findActive.mockResolvedValue(membershipDocuments);

      // Act
      const result = await membershipsService.findAll();

      // Assert
      expect(memberships.findActive).toHaveBeenCalledTimes(1);
      expect(result).toEqual(membershipDocuments);
    });
  });

  describe('upsert', () => {
    it('should map the local deletion flag without forwarding it as a field', async () => {
      // Arrange
      const membership = {
        _id: 'membership-id',
        playerId: 'player-id',
        teamId: 'team-id',
        number: 9,
        position: 'Armador',
        status: 'ACTIVE' as const,
        isDeleted: true,
      };
      const savedMembership = { ...membership };
      memberships.upsert.mockResolvedValue(savedMembership);

      // Act
      const result = await membershipsService.upsert(membership);

      // Assert
      expect(memberships.upsert).toHaveBeenCalledWith(membership._id, {
        playerId: membership.playerId,
        teamId: membership.teamId,
        number: membership.number,
        position: membership.position,
        status: membership.status,
        deleted: true,
      });
      expect(result).toEqual(savedMembership);
    });

    it('should preserve the API deletion flag when syncing remote data', async () => {
      // Arrange
      const membership = {
        _id: 'membership-id',
        playerId: 'player-id',
        teamId: 'team-id',
        number: 9,
        position: 'Armador',
        status: 'ACTIVE' as const,
        deleted: true,
      };
      memberships.upsert.mockResolvedValue(membership);

      // Act
      await membershipsService.upsert(membership);

      // Assert
      expect(memberships.upsert).toHaveBeenCalledWith(membership._id, {
        playerId: membership.playerId,
        teamId: membership.teamId,
        number: membership.number,
        position: membership.position,
        status: membership.status,
        deleted: true,
      });
    });
  });

  describe('sync', () => {
    it('should upsert every membership in input order', async () => {
      // Arrange
      const firstMembership = { _id: 'membership-a', playerId: 'player-a' } as any;
      const secondMembership = { _id: 'membership-b', playerId: 'player-b' } as any;
      const firstResult = { ...firstMembership } as PlayerMembershipDocument;
      const secondResult = { ...secondMembership } as PlayerMembershipDocument;
      const upsert = jest
        .spyOn(membershipsService, 'upsert')
        .mockResolvedValueOnce(firstResult)
        .mockResolvedValueOnce(secondResult);

      // Act
      const result = await membershipsService.sync([firstMembership, secondMembership]);

      // Assert
      expect(upsert).toHaveBeenNthCalledWith(1, firstMembership);
      expect(upsert).toHaveBeenNthCalledWith(2, secondMembership);
      expect(result).toEqual([firstResult, secondResult]);
    });
  });
});
