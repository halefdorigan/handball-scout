import { TeamsService } from '../teams.service';
import { TeamDocument } from '../schemas/team.schema';
import { TeamRepository } from '../repositories/team.repository';

describe('TeamsService', () => {
  let teamsService: TeamsService;
  let teams: {
    findActive: jest.Mock;
    findById: jest.Mock;
    upsert: jest.Mock;
  };

  beforeEach(() => {
    teams = {
      findActive: jest.fn(),
      findById: jest.fn(),
      upsert: jest.fn(),
    };
    teamsService = new TeamsService(teams as unknown as TeamRepository);
  });

  describe('findAll', () => {
    it('should return non-deleted teams', async () => {
      // Arrange
      const teamDocuments = [{ _id: 'team-id', name: 'Team A' }];
      teams.findActive.mockResolvedValue(teamDocuments);

      // Act
      const result = await teamsService.findAll();

      // Assert
      expect(teams.findActive).toHaveBeenCalledTimes(1);
      expect(result).toEqual(teamDocuments);
    });
  });

  describe('findOne', () => {
    it('should return the team with the requested id', async () => {
      // Arrange
      const team = { _id: 'team-id', name: 'Team A' };
      teams.findById.mockResolvedValue(team);

      // Act
      const result = await teamsService.findOne('team-id');

      // Assert
      expect(teams.findById).toHaveBeenCalledWith('team-id');
      expect(result).toEqual(team);
    });
  });

  describe('upsert', () => {
    it('should update a team without forwarding the id as update data', async () => {
      // Arrange
      const team = { _id: 'team-id', name: 'Team A', color: '#fff' };
      const savedTeam = { ...team };
      teams.upsert.mockResolvedValue(savedTeam);

      // Act
      const result = await teamsService.upsert(team);

      // Assert
      expect(teams.upsert).toHaveBeenCalledWith(team._id, {
        name: team.name,
        color: team.color,
      });
      expect(result).toEqual(savedTeam);
    });

    it('should persist the local deletion flag as deleted', async () => {
      // Arrange
      const team = { _id: 'team-id', name: 'Team A', isDeleted: true };
      const savedTeam = { ...team, deleted: true };
      teams.upsert.mockResolvedValue(savedTeam);

      // Act
      const result = await teamsService.upsert(team);

      // Assert
      expect(teams.upsert).toHaveBeenCalledWith(team._id, {
        name: team.name,
        deleted: true,
      });
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
