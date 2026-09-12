import { GamesController } from '../games.controller';
import { GamesService } from '../games.service';

describe('GamesController', () => {
  let gamesController: GamesController;
  let gamesService: {
    findAll: jest.Mock;
    sync: jest.Mock;
  };

  beforeEach(() => {
    gamesService = {
      findAll: jest.fn(),
      sync: jest.fn(),
    };
    gamesController = new GamesController(
      gamesService as unknown as GamesService,
    );
  });

  it('should return all games', async () => {
    // Arrange
    const games = [{ _id: 'game-id', name: 'Game A' }];
    gamesService.findAll.mockResolvedValue(games);

    // Act
    const result = (await gamesController.findAll()) as unknown;

    // Assert
    expect(gamesService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(games);
  });

  it('should synchronize games', async () => {
    // Arrange
    const games = [{ _id: 'game-id', name: 'Game A' }];
    gamesService.sync.mockResolvedValue(games);

    // Act
    const result = (await gamesController.sync(games)) as unknown;

    // Assert
    expect(gamesService.sync).toHaveBeenCalledWith(games);
    expect(result).toEqual(games);
  });
});
