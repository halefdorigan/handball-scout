import { PlayersController } from '../players.controller';
import { PlayersService } from '../players.service';

describe('PlayersController', () => {
  let playersController: PlayersController;
  let playersService: {
    findAll: jest.Mock;
    sync: jest.Mock;
  };

  beforeEach(() => {
    playersService = {
      findAll: jest.fn(),
      sync: jest.fn(),
    };
    playersController = new PlayersController(playersService as unknown as PlayersService);
  });

  it('should return all players', async () => {
    // Arrange
    const players = [{ _id: 'player-id', name: 'Player A' }];
    playersService.findAll.mockResolvedValue(players);

    // Act
    const result = (await playersController.findAll()) as unknown;

    // Assert
    expect(playersService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(players);
  });

  it('should synchronize players', async () => {
    // Arrange
    const players = [{ _id: 'player-id', name: 'Player A' }];
    playersService.sync.mockResolvedValue(players);

    // Act
    const result = (await playersController.sync(players)) as unknown;

    // Assert
    expect(playersService.sync).toHaveBeenCalledWith(players);
    expect(result).toEqual(players);
  });
});
