import { TeamsController } from '../teams.controller';
import { TeamsService } from '../teams.service';

describe('TeamsController', () => {
  let teamsController: TeamsController;
  let teamsService: {
    findAll: jest.Mock;
    sync: jest.Mock;
  };

  beforeEach(() => {
    teamsService = {
      findAll: jest.fn(),
      sync: jest.fn(),
    };
    teamsController = new TeamsController(
      teamsService as unknown as TeamsService,
    );
  });

  it('should return all teams', async () => {
    // Arrange
    const teams = [{ _id: 'team-id', name: 'Team A' }];
    teamsService.findAll.mockResolvedValue(teams);

    // Act
    const result = (await teamsController.findAll()) as unknown;

    // Assert
    expect(teamsService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(teams);
  });

  it('should synchronize teams', async () => {
    // Arrange
    const teams = [{ _id: 'team-id', name: 'Team A' }];
    teamsService.sync.mockResolvedValue(teams);

    // Act
    const result = (await teamsController.sync(teams)) as unknown;

    // Assert
    expect(teamsService.sync).toHaveBeenCalledWith(teams);
    expect(result).toEqual(teams);
  });
});
