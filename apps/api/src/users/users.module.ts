import { Module } from '@nestjs/common';
import { UserController } from './users.controller.js';
import { UserRepository } from './users.repository.js';
import { UserService } from './users.service.js';

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