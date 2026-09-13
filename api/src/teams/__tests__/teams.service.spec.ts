import { Model } from 'mongoose';
import { TeamsService } from '../teams.service';
import { TeamDocument } from '../schemas/team.schema';

describe('TeamsService', () => {
  let teamsService: TeamsService;
  let teamModel: {
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };

  beforeEach(() => {
    teamModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };
    teamsService = new TeamsService(teamModel as unknown as Model<TeamDocument>);
  });

  describe('findAll', () => {
    it('should return non-deleted teams', async () => {
      // Arrange
      const teams = [{ _id: 'team-id', name: 'Team A' }];
      const exec = jest.fn().mockResolvedValue(teams);
      teamModel.find.mockReturnValue({ exec });

      // Act
      const result = await teamsService.findAll();

      // Assert
      expect(teamModel.find).toHaveBeenCalledWith({ deleted: false });
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(teams);
    });
  });

  describe('findOne', () => {
    it('should return the team with the requested id', async () => {
      // Arrange
      const team = { _id: 'team-id', name: 'Team A' };
      const exec = jest.fn().mockResolvedValue(team);
      teamModel.findById.mockReturnValue({ exec });

      // Act
      const result = await teamsService.findOne('team-id');

      // Assert
      expect(teamModel.findById).toHaveBeenCalledWith('team-id');
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(team);
    });
  });

  describe('upsert', () => {
    it('should update a team without forwarding the id as update data', async () => {
      // Arrange
      const team = { _id: 'team-id', name: 'Team A', color: '#fff' };
      const savedTeam = { ...team };
      const exec = jest.fn().mockResolvedValue(savedTeam);
      teamModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      const result = await teamsService.upsert(team);

      // Assert
      expect(teamModel.findByIdAndUpdate).toHaveBeenCalledWith(
        team._id,
        { name: team.name, color: team.color },
        { upsert: true, new: true },
      );
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedTeam);
    });

    it('should persist the local deletion flag as deleted', async () => {
      // Arrange
      const team = { _id: 'team-id', name: 'Team A', isDeleted: true };
      const savedTeam = { ...team, deleted: true };
      const exec = jest.fn().mockResolvedValue(savedTeam);
      teamModel.findByIdAndUpdate.mockReturnValue({ exec });

      // Act
      const result = await teamsService.upsert(team);

      // Assert
      expect(teamModel.findByIdAndUpdate).toHaveBeenCalledWith(
        team._id,
        { name: team.name, deleted: true },
        { upsert: true, new: true },
      );
      expect(result).toEqual(savedTeam);
    });
  });

  describe('sync', () => {
    it('should upsert every team and return the results in input order', async () => {
      // Arrange
      const firstTeam = { _id: 'team-a', name: 'Team A' };
      const secondTeam = { _id: 'team-b', name: 'Team B' };
      const firstResult = { ...firstTeam };
      const secondResult = { ...secondTeam };
      const upsert = jest
        .spyOn(teamsService, 'upsert')
        .mockResolvedValueOnce(firstResult as TeamDocument)
        .mockResolvedValueOnce(secondResult as TeamDocument);

      // Act
      const result = (await teamsService.sync([firstTeam, secondTeam])) as unknown;

      // Assert
      expect(upsert).toHaveBeenNthCalledWith(1, firstTeam);
      expect(upsert).toHaveBeenNthCalledWith(2, secondTeam);
      expect(result).toEqual([firstResult, secondResult]);
    });
  });
});
