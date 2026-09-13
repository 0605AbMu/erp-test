import { Roles } from '@erp-test/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { QueryDto } from '../common/dto/query.dto.js';
import type { AuthorizedUser } from '../common/types/authorized-user.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { UserRepository } from './users.repository.js';
import { UserService } from './users.service.js';

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
  getAll(@Query() query: QueryDto) {
    return this.userRepository.fetchAllUsers(query);
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
  removeUser(@Param('id') userId: number, @CurrentUser() user: AuthorizedUser) {
    return this.userService.remove(user.id, userId);
  }
}