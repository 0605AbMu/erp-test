import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { AuthRepository } from './auth.repository.js';
import { Roles } from '@erp-test/shared';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthorizedUser } from '../common/types/authorized-user.js';
import { UserRepository } from '../users/users.repository.js';
import { AssignRoleDto } from './dto/assign-role.dto.js';

@Controller({
  path: 'auth',
  version: '1'
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepository,
  ) { }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Authorization(Roles.ADMIN)
  @Get('roles')
  getAllRoles() {
    return this.authRepository.getAllRoles();
  }

  @Authorization(Roles.ADMIN)
  @Post('assign-role')
  assignRole(@CurrentUser() user: AuthorizedUser, @Body() dto: AssignRoleDto) {
    return this.authService.assignRole(user.id, dto);
  }

  @Authorization(Roles.USER)
  @Get('me')
  getMe(@CurrentUser() user: AuthorizedUser): {
    name: string;
  } {
    return this.authService.getUser(user.id) as any;
  }

  @Authorization(Roles.ADMIN)
  @Get('user/:id')
  getUser(@Param('id') userId: number){
    return this.authService.getUser(userId) as any;
  }
}