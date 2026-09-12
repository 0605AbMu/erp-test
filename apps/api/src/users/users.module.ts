import { Module } from '@nestjs/common';
import { UserService } from './users.service.js';
import { UserRepository } from './users.repository.js';
import { UserController } from './users.controller.js';

@Module({
  imports: [
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}