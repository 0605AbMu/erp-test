import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { UserService } from './users.service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthorizedUser } from '../common/types/authorized-user.js';
import { UserRepository } from './users.repository.js';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { Roles } from '@erp-test/shared';
import { ApiParam, ApiProperty } from '@nestjs/swagger';

@Controller({
  path: 'users',
  version: '1'
})
@Authorization(Roles.ADMIN)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository
  ) { }

  @Get()
  getAll() {
    return this.userRepository.fetchAllUsers();
  }

  @Post()
  createUser(@Body() dto: CreateUserDto, @CurrentUser() user: AuthorizedUser) {
    return this.userService.create(user.id, dto);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'UserId'
  })
  updateUser(@Body() dto: UpdateUserDto, @Param('id') userId: number, @CurrentUser() user: AuthorizedUser) {
    return this.userService.update(user.id, userId, dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'UserId'
  })
  removeUser(@Param('id') userId: number) {
    return this.userService.remove(userId);
  }
}