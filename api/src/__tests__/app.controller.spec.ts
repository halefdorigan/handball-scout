import { AppController } from '../app.controller';
import { AppService } from '../app.service';

describe('AppController', () => {
  it('should return the greeting provided by AppService', () => {
    // Arrange
    const appService = {
      getHello: jest.fn().mockReturnValue('Hello World!'),
    };
    const appController = new AppController(appService as unknown as AppService);

    // Act
    const result = appController.getHello();

    // Assert
    expect(result).toBe('Hello World!');
    expect(appService.getHello).toHaveBeenCalledTimes(1);
  });
});
