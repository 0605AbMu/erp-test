import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UserRepository } from '../users/users.repository.js';
import { AssignRoleDto } from './dto/assign-role.dto.js';
import { DbService } from '../db/db.service.js';
import { Roles } from '@erp-test/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly dbService: DbService
  ) { }

  private readonly logger = new Logger(AuthService.name);

  async register(dto: RegisterDto) {
    const existingUser = await this.repository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const roles = await this.repository.getAllRoles();
    const userRole = roles.find(x => x.name === Roles.USER);

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.dbService.transactional(async (client) => {
      const user = await this.repository.createUser({
        name: dto.name,
        surname: dto.surname,
        email: dto.email,
        passwordHash,
      }, client);

      await this.repository.assignRole({
        grantUserId: user.id,
        roleId: userRole.id,
        userId: user.id
      }, client);

      return user;
    })

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.repository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active)
      throw new UnauthorizedException('User inactive');

    const roles = await this.repository.getUserRoles(user.id);

    if (roles.length == 0)
      throw new UnauthorizedException('User inactive');

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      roles: roles.map(x => x.name)
    });

    return {
      accessToken,
    };
  }

  async getUser(userId: number) {
    const user = await this.userRepository.findByIdWithoutPassword(userId);
    const roles = await this.repository.getUserRoles(userId);

    return {
      ...user,
      roles
    }
  }

  async assignRole(userId: number, dto: AssignRoleDto) {

    const userExistedRoles = await this.repository.getUserRoles(dto.userId);

    if (userExistedRoles.findIndex(x => x.role_id == dto.roleId) !== -1)
      throw new BadRequestException('User already in role');

    await this.repository.assignRole({
      grantUserId: userId,
      roleId: dto.roleId,
      userId: dto.userId
    });

    this.logger.log('Role assigned', { ...dto, grantUserId: userId });
  }
}