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
    playersService = new PlayersService(
      playerModel as unknown as Model<PlayerDocument>,
    );
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
    it('should update a player without forwarding the id as update data', async () => {
      // Arrange
      const player = {
        _id: 'player-id',
        teamId: 'team-id',
        name: 'Player A',
      };
      const savedPlayer = { ...player };
      const exec = jest.fn().mockResolvedValue(savedPlayer);
      playerModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      const result = await playersService.upsert(player);

      // Assert
      expect(playerModel.findByIdAndUpdate).toHaveBeenCalledWith(
        player._id,
        { teamId: player.teamId, name: player.name },
        { upsert: true, new: true },
      );
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedPlayer);
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
      const result = (await playersService.sync([
        firstPlayer,
        secondPlayer,
      ])) as unknown;

      // Assert
      expect(upsert).toHaveBeenNthCalledWith(1, firstPlayer);
      expect(upsert).toHaveBeenNthCalledWith(2, secondPlayer);
      expect(result).toEqual([firstResult, secondResult]);
    });
  });
});
