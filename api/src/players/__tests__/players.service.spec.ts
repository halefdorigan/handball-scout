import { Model } from 'mongoose';
import { PlayersService } from '../players.service';
import { PlayerDocument } from '../schemas/player.schema';

describe('PlayersService', () => {
  let playersService: PlayersService;
  let playerModel: {
    find: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };

  beforeEach(() => {
    playerModel = {
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };
    playersService = new PlayersService(playerModel as unknown as Model<PlayerDocument>);
  });

  describe('findAll', () => {
    it('should return non-deleted players', async () => {
      // Arrange
      const players = [{ _id: 'player-id', name: 'Player A' }];
      const exec = jest.fn().mockResolvedValue(players);
      playerModel.find.mockReturnValue({ exec });

      // Act
      const result = await playersService.findAll();

      // Assert
      expect(playerModel.find).toHaveBeenCalledWith({ deleted: false });
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(players);
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
      const exec = jest.fn().mockResolvedValue(savedPlayer);
      playerModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      const result = await playersService.upsert(player);

      // Assert
      expect(playerModel.findByIdAndUpdate).toHaveBeenCalledWith(
        player._id,
        {
          name: player.name,
          birthDate: player.birthDate,
          heightCm: player.heightCm,
          weightKg: player.weightKg,
          dominantHand: player.dominantHand,
        },
        { upsert: true, new: true },
      );
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedPlayer);
    });

    it('should map the local deletion flag to the API field', async () => {
      // Arrange
      const player = {
        _id: 'player-id',
        name: 'Player A',
        isDeleted: true,
      };
      const exec = jest.fn().mockResolvedValue(player);
      playerModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      await playersService.upsert(player);

      // Assert
      expect(playerModel.findByIdAndUpdate).toHaveBeenCalledWith(
        player._id,
        { name: player.name, deleted: true },
        { upsert: true, new: true },
      );
    });

    it('should preserve the API deletion flag when syncing remote data', async () => {
      // Arrange
      const player = {
        _id: 'player-id',
        name: 'Player A',
        deleted: true,
      };
      const exec = jest.fn().mockResolvedValue(player);
      playerModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      await playersService.upsert(player);

      // Assert
      expect(playerModel.findByIdAndUpdate).toHaveBeenCalledWith(
        player._id,
        { name: player.name, deleted: true },
        { upsert: true, new: true },
      );
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
