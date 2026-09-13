import { Model } from 'mongoose';
import { GamesService } from '../games.service';
import { GameDocument } from '../schemas/game.schema';

describe('GamesService', () => {
  let gamesService: GamesService;
  let gameModel: {
    find: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };

  beforeEach(() => {
    gameModel = {
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };
    gamesService = new GamesService(gameModel as unknown as Model<GameDocument>);
  });

  describe('findAll', () => {
    it('should return non-deleted games', async () => {
      // Arrange
      const games = [{ _id: 'game-id', name: 'Game A' }];
      const exec = jest.fn().mockResolvedValue(games);
      gameModel.find.mockReturnValue({ exec });

      // Act
      const result = await gamesService.findAll();

      // Assert
      expect(gameModel.find).toHaveBeenCalledWith({ deleted: false });
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(games);
    });
  });

  describe('upsert', () => {
    it('should update a game without forwarding the id as update data', async () => {
      // Arrange
      const game = { _id: 'game-id', name: 'Game A', status: 'PENDING' };
      const savedGame = { ...game };
      const exec = jest.fn().mockResolvedValue(savedGame);
      gameModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      const result = await gamesService.upsert(game);

      // Assert
      expect(gameModel.findByIdAndUpdate).toHaveBeenCalledWith(
        game._id,
        { name: game.name, status: game.status },
        { upsert: true, new: true },
      );
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedGame);
    });
  });

  describe('sync', () => {
    it('should upsert every game and return the results in input order', async () => {
      // Arrange
      const firstGame = { _id: 'game-a', name: 'Game A' };
      const secondGame = { _id: 'game-b', name: 'Game B' };
      const firstResult = { ...firstGame };
      const secondResult = { ...secondGame };
      const upsert = jest
        .spyOn(gamesService, 'upsert')
        .mockResolvedValueOnce(firstResult as GameDocument)
        .mockResolvedValueOnce(secondResult as GameDocument);

      // Act
      const result = (await gamesService.sync([firstGame, secondGame])) as unknown;

      // Assert
      expect(upsert).toHaveBeenNthCalledWith(1, firstGame);
      expect(upsert).toHaveBeenNthCalledWith(2, secondGame);
      expect(result).toEqual([firstResult, secondResult]);
    });
  });
});
