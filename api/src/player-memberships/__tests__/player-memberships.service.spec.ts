import { Model } from 'mongoose';
import { PlayerMembershipDocument } from '../schemas/player-membership.schema';
import { PlayerMembershipsService } from '../player-memberships.service';

describe('PlayerMembershipsService', () => {
  let membershipsService: PlayerMembershipsService;
  let membershipModel: {
    find: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };

  beforeEach(() => {
    membershipModel = {
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };
    membershipsService = new PlayerMembershipsService(membershipModel as unknown as Model<PlayerMembershipDocument>);
  });

  describe('findAll', () => {
    it('should return non-deleted memberships', async () => {
      // Arrange
      const memberships = [{ _id: 'membership-id', playerId: 'player-id' }];
      const exec = jest.fn().mockResolvedValue(memberships);
      membershipModel.find.mockReturnValue({ exec });

      // Act
      const result = await membershipsService.findAll();

      // Assert
      expect(membershipModel.find).toHaveBeenCalledWith({ deleted: false });
      expect(result).toEqual(memberships);
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
      const exec = jest.fn().mockResolvedValue(savedMembership);
      membershipModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      const result = await membershipsService.upsert(membership);

      // Assert
      expect(membershipModel.findByIdAndUpdate).toHaveBeenCalledWith(
        membership._id,
        {
          playerId: membership.playerId,
          teamId: membership.teamId,
          number: membership.number,
          position: membership.position,
          status: membership.status,
          deleted: true,
        },
        { upsert: true, new: true },
      );
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
      const exec = jest.fn().mockResolvedValue(membership);
      membershipModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      await membershipsService.upsert(membership);

      // Assert
      expect(membershipModel.findByIdAndUpdate).toHaveBeenCalledWith(
        membership._id,
        {
          playerId: membership.playerId,
          teamId: membership.teamId,
          number: membership.number,
          position: membership.position,
          status: membership.status,
          deleted: true,
        },
        { upsert: true, new: true },
      );
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
