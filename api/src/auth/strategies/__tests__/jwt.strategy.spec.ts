import { JwtStrategy } from '../jwt.strategy';

describe('JwtStrategy', () => {
  it('should map the JWT payload to the authenticated user', async () => {
    // Arrange
    const strategy = new JwtStrategy();
    const payload = { sub: 'user-id', email: 'athlete@example.com' };

    // Act
    const result = await strategy.validate(payload);

    // Assert
    expect(result).toEqual({
      userId: payload.sub,
      email: payload.email,
    });
  });
});
