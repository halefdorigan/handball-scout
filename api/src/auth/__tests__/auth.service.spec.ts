jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { User } from '../schemas/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: jest.Mock & { findOne: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    userModel = jest.fn() as jest.Mock & { findOne: jest.Mock };
    userModel.findOne = jest.fn();
    jwtService = { sign: jest.fn() };
    authService = new AuthService(userModel as unknown as Model<User>, jwtService as unknown as JwtService);
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
      userModel.findOne.mockResolvedValue(userDocument);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = (await authService.validateUser(email, password)) as unknown;

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
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
      userModel.findOne.mockResolvedValue(null);

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
      userModel.findOne.mockResolvedValue(userDocument);
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
    it('should hash the password, create the user and save it', async () => {
      // Arrange
      const email = 'athlete@example.com';
      const password = 'secret';
      const name = 'Athlete';
      const savedUser = { _id: 'user-id', email, name };
      const save = jest.fn().mockResolvedValue(savedUser);
      userModel.mockImplementation((data: unknown) => ({ data, save }));
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      // Act
      const result = (await authService.register(email, password, name)) as unknown;

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userModel).toHaveBeenCalledWith({
        email,
        passwordHash: 'hashed-password',
        name,
      });
      expect(save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedUser);
    });
  });
});
