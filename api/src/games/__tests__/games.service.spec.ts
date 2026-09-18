import { GamesService } from '../games.service';
import { GameDocument } from '../schemas/game.schema';
import { GameRepository } from '../repositories/game.repository';
import { MatchRepository } from '../../matches/repositories/match.repository';
import { ScoutingSessionRepository } from '../../scouting/repositories/scouting-session.repository';

describe('GamesService', () => {
  let gamesService: GamesService;
  let games: {
    findActive: jest.Mock;
    upsert: jest.Mock;
  };
  let matches: { upsert: jest.Mock };
  let sessions: { upsert: jest.Mock };

  beforeEach(() => {
    games = {
      findActive: jest.fn(),
      upsert: jest.fn(),
    };
    matches = { upsert: jest.fn() };
    sessions = { upsert: jest.fn() };
    gamesService = new GamesService(
      games as unknown as GameRepository,
      matches as unknown as MatchRepository,
      sessions as unknown as ScoutingSessionRepository,
    );
  });

  describe('findAll', () => {
    it('should return non-deleted games', async () => {
      // Arrange
      const gameDocuments = [{ _id: 'game-id', name: 'Game A' }];
      games.findActive.mockResolvedValue(gameDocuments);

      // Act
      const result = await gamesService.findAll();

      // Assert
      expect(games.findActive).toHaveBeenCalledTimes(1);
      expect(result).toEqual(gameDocuments);
    });
  });

  describe('upsert', () => {
    it('should update a game without forwarding the id as update data', async () => {
      // Arrange
      const game = { _id: 'game-id', name: 'Game A', status: 'PENDING' };
      const savedGame = { ...game };
      games.upsert.mockResolvedValue(savedGame);

      // Act
      const result = await gamesService.upsert(game);

      // Assert
      expect(games.upsert).toHaveBeenCalledWith(game._id, {
        name: game.name,
        status: game.status,
      });
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
      expect(matches.upsert).toHaveBeenNthCalledWith(
        1,
        firstGame._id,
        expect.objectContaining({ name: firstGame.name }),
      );
      expect(matches.upsert).toHaveBeenNthCalledWith(
        2,
        secondGame._id,
        expect.objectContaining({ name: secondGame.name }),
      );
      expect(sessions.upsert).toHaveBeenNthCalledWith(1, `scout-${firstGame._id}`, expect.any(Object));
      expect(sessions.upsert).toHaveBeenNthCalledWith(2, `scout-${secondGame._id}`, expect.any(Object));
      expect(result).toEqual([firstResult, secondResult]);
    });
  });
});
