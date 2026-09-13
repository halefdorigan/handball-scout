import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './repositories/user.repository';

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }

  return value;
}

const jwtSecret = requiredEnvironmentVariable('JWT_SECRET');
const jwtExpiresIn = requiredEnvironmentVariable('JWT_EXPIRES_IN') as JwtSignOptions['expiresIn'];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: jwtExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
