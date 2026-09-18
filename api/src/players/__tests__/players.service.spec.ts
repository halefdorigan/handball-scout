import { PlayersService } from '../players.service';
import { PlayerDocument } from '../schemas/player.schema';
import { PlayerRepository } from '../repositories/player.repository';

describe('PlayersService', () => {
  let playersService: PlayersService;
  let players: {
    findActive: jest.Mock;
    upsert: jest.Mock;
  };

  beforeEach(() => {
    players = {
      findActive: jest.fn(),
      upsert: jest.fn(),
    };
    playersService = new PlayersService(players as unknown as PlayerRepository);
  });

  describe('findAll', () => {
    it('should return non-deleted players', async () => {
      // Arrange
      const playerDocuments = [{ _id: 'player-id', name: 'Player A' }];
      players.findActive.mockResolvedValue(playerDocuments);

      // Act
      const result = await playersService.findAll();

      // Assert
      expect(players.findActive).toHaveBeenCalledTimes(1);
      expect(result).toEqual(playerDocuments);
    });
  });

  describe('upsert', () => {
    it('should update a player without forwarding the id or legacy team fields', async () => {
      // Arrange
      const player = {
        _id: 'player-id',
        name: 'Player A',
        birthDate: '2000-01-01',
        heightCm: 180,
        weightKg: 75,
        dominantHand: 'RIGHT' as const,
        teamId: 'legacy-team-id',
        number: 7,
        position: 'Ponta',
      };
      const savedPlayer = { ...player };
      players.upsert.mockResolvedValue(savedPlayer);

      // Act
      const result = await playersService.upsert(player);

      // Assert
      expect(players.upsert).toHaveBeenCalledWith(player._id, {
        name: player.name,
        birthDate: player.birthDate,
        heightCm: player.heightCm,
        weightKg: player.weightKg,
        dominantHand: player.dominantHand,
      });
      expect(result).toEqual(savedPlayer);
    });

    it('should map the local deletion flag to the API field', async () => {
      // Arrange
      const player = {
        _id: 'player-id',
        name: 'Player A',
        isDeleted: true,
      };
      players.upsert.mockResolvedValue(player);

      // Act
      await playersService.upsert(player);

      // Assert
      expect(players.upsert).toHaveBeenCalledWith(player._id, {
        name: player.name,
        deleted: true,
      });
    });

    it('should preserve the API deletion flag when syncing remote data', async () => {
      // Arrange
      const player = {
        _id: 'player-id',
        name: 'Player A',
        deleted: true,
      };
      players.upsert.mockResolvedValue(player);

      // Act
      await playersService.upsert(player);

      // Assert
      expect(players.upsert).toHaveBeenCalledWith(player._id, {
        name: player.name,
        deleted: true,
      });
    });
  });

  describe('sync', () => {
    it('should upsert every player and return the results in input order', async () => {
      // Arrange
      const firstPlayer = { _id: 'player-a', name: 'Player A' };
      const secondPlayer = { _id: 'player-b', name: 'Player B' };
      const firstResult = { ...firstPlayer };
      const secondResult = { ...secondPlayer };
      const upsert = jest
        .spyOn(playersService, 'upsert')
        .mockResolvedValueOnce(firstResult as PlayerDocument)
        .mockResolvedValueOnce(secondResult as PlayerDocument);

      // Act
      const result = (await playersService.sync([firstPlayer, secondPlayer])) as unknown;

      // Assert
      expect(upsert).toHaveBeenNthCalledWith(1, firstPlayer);
      expect(upsert).toHaveBeenNthCalledWith(2, secondPlayer);
      expect(result).toEqual([firstResult, secondResult]);
    });
  });
});
