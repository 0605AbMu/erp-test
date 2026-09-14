import { Roles } from '@erp-test/shared';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import type { AuthorizedUser } from '../common/types/authorized-user.js';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AssignRoleDto } from './dto/assign-role.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UpdateCredentialsDto } from './dto/update-credentials.dto.js';
import type { Request, Response } from 'express';
import { ConfigService } from '../config/config.service.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';

@Controller({
  path: 'auth',
  version: '1'
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService
  ) { }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {

    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    return await this.authService.login(dto, ip, userAgent);
  }

  @Post('logout')
  async logout(@CurrentUser() user: AuthorizedUser) {
    return await this.authService.logout(user.id);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return await this.authService.refreshToken(dto);
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

  @Authorization(Roles.ADMIN)
  @Post('unassign-role')
  unassignRole(@CurrentUser() user: AuthorizedUser, @Body() dto: AssignRoleDto) {
    return this.authService.unassignRole(user.id, dto);
  }

  @Get('me')
  getMe(@CurrentUser() user: AuthorizedUser): {
    name: string;
  } {
    return this.authService.getUser(user.id) as any;
  }

  @Authorization(Roles.ADMIN)
  @Get('user/:id')
  getUser(@Param('id') userId: number) {
    return this.authService.getUser(userId) as any;
  }

  @Put('update-credentials')
  updateCredentials(@CurrentUser() user: AuthorizedUser, @Body() dto: UpdateCredentialsDto) {
    return this.authService.updateUserCredentials(user.id, dto);
  }

}