jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { UserRepository } from '../repositories/user.repository';

describe('AuthService', () => {
  let authService: AuthService;
  let users: { findByEmail: jest.Mock; create: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    users = { findByEmail: jest.fn(), create: jest.fn() };
    jwtService = { sign: jest.fn() };
    authService = new AuthService(users as unknown as UserRepository, jwtService as unknown as JwtService);
  });

  describe('validateUser', () => {
    it('should return the user without the password hash when credentials are valid', async () => {
      // Arrange
      const email = 'athlete@example.com';
      const password = 'secret';
      const userDocument = {
        passwordHash: 'hashed-password',
        toObject: jest.fn().mockReturnValue({
          _id: 'user-id',
          email,
          name: 'Athlete',
          passwordHash: 'hashed-password',
        }),
      };
      users.findByEmail.mockResolvedValue(userDocument);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = (await authService.validateUser(email, password)) as unknown;

      // Assert
      expect(users.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, userDocument.passwordHash);
      expect(userDocument.toObject).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        _id: 'user-id',
        email,
        name: 'Athlete',
      });
    });

    it('should return null when the user does not exist', async () => {
      // Arrange
      const email = 'missing@example.com';
      users.findByEmail.mockResolvedValue(null);

      // Act
      const result = (await authService.validateUser(email, 'secret')) as unknown;

      // Assert
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when the password is invalid', async () => {
      // Arrange
      const userDocument = {
        passwordHash: 'hashed-password',
        toObject: jest.fn(),
      };
      users.findByEmail.mockResolvedValue(userDocument);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = (await authService.validateUser('athlete@example.com', 'wrong')) as unknown;

      // Assert
      expect(result).toBeNull();
      expect(userDocument.toObject).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should sign the user payload and return the user', async () => {
      // Arrange
      const user = { _id: 'user-id', email: 'athlete@example.com' };
      jwtService.sign.mockReturnValue('signed-token');

      // Act
      const result = (await authService.login(user)) as unknown;

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user._id,
      });
      expect(result).toEqual({ access_token: 'signed-token', user });
    });
  });

  describe('register', () => {
    it('should hash the password and create the user through the repository', async () => {
      // Arrange
      const email = 'athlete@example.com';
      const password = 'secret';
      const name = 'Athlete';
      const savedUser = { _id: 'user-id', email, name };
      users.create.mockResolvedValue(savedUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      // Act
      const result = (await authService.register(email, password, name)) as unknown;

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(users.create).toHaveBeenCalledWith(email, 'hashed-password', name);
      expect(result).toEqual(savedUser);
    });
  });
});
