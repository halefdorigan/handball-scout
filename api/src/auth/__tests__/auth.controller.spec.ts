import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: {
    validateUser: jest.Mock;
    login: jest.Mock;
    register: jest.Mock;
  };

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
    };
    authController = new AuthController(authService as unknown as AuthService);
  });

  describe('login', () => {
    it('should validate the credentials and return the login result', async () => {
      // Arrange
      const body = { email: 'athlete@example.com', password: 'secret' };
      const user = { _id: 'user-id', email: body.email };
      const loginResult = { access_token: 'token', user };
      authService.validateUser.mockResolvedValue(user);
      authService.login.mockResolvedValue(loginResult);

      // Act
      const result = await authController.login(body);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(body.email, body.password);
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(loginResult);
    });

    it('should reject invalid credentials', async () => {
      // Arrange
      const body = { email: 'athlete@example.com', password: 'wrong' };
      authService.validateUser.mockResolvedValue(null);

      // Act
      const action = authController.login(body);

      // Assert
      await expect(action).rejects.toBeInstanceOf(UnauthorizedException);
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should delegate registration to AuthService', async () => {
      // Arrange
      const body = {
        email: 'athlete@example.com',
        password: 'secret',
        name: 'Athlete',
      };
      const registeredUser = { _id: 'user-id', email: body.email };
      authService.register.mockResolvedValue(registeredUser);

      // Act
      const result = await authController.register(body);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(body.email, body.password, body.name);
      expect(result).toEqual(registeredUser);
    });
  });
});
