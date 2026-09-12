import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { ConfigService } from '../config/config.service.js';
import { UserRepository } from '../users/users.repository.js';
import { UserModule } from '../users/users.module.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.jwtSecret.secret,
        signOptions: { expiresIn: config.jwtSecret.expiresIn as any },
      }),
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }