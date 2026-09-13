import { PlayerMembershipsController } from '../player-memberships.controller';
import { PlayerMembershipsService } from '../player-memberships.service';

describe('PlayerMembershipsController', () => {
  let membershipsController: PlayerMembershipsController;
  let membershipsService: {
    findAll: jest.Mock;
    sync: jest.Mock;
  };

  beforeEach(() => {
    membershipsService = {
      findAll: jest.fn(),
      sync: jest.fn(),
    };
    membershipsController = new PlayerMembershipsController(membershipsService as unknown as PlayerMembershipsService);
  });

  it('should return all memberships', async () => {
    // Arrange
    const memberships = [{ _id: 'membership-id', playerId: 'player-id' }];
    membershipsService.findAll.mockResolvedValue(memberships);

    // Act
    const result = await membershipsController.findAll();

    // Assert
    expect(membershipsService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(memberships);
  });

  it('should synchronize memberships', async () => {
    // Arrange
    const memberships = [{ _id: 'membership-id', playerId: 'player-id' }];
    membershipsService.sync.mockResolvedValue(memberships);

    // Act
    const result = await membershipsController.sync(memberships);

    // Assert
    expect(membershipsService.sync).toHaveBeenCalledWith(memberships);
    expect(result).toEqual(memberships);
  });
});
