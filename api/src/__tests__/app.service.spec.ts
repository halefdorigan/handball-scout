import { AppService } from '../app.service';

describe('AppService', () => {
  it('should return the greeting', () => {
    // Arrange
    const appService = new AppService();

    // Act
    const result = appService.getHello();

    // Assert
    expect(result).toBe('Hello World!');
  });
});
