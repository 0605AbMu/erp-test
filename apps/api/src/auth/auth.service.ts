import { UserResponse } from '@erp-test/shared';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { hashPassword } from '../common/utils/password.util.js';
import { UserRepository } from '../users/users.repository.js';
import { AuthRepository } from './auth.repository.js';
import { AssignRoleDto } from './dto/assign-role.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UpdateCredentialsDto } from './dto/update-credentials.dto.js';
import { createHash, randomBytes } from 'node:crypto';
import { ConfigService } from '../config/config.service.js';
import { DbService } from '../db/db.service.js';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { authTokenVersionKey } from '../common/utils/cache-keys.util.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly db: DbService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) { }

  private readonly logger = new Logger(AuthService.name);

  async register(dto: RegisterDto) {
    const existingUser = await this.repository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Bu email allaqachon mavjud');
    }

    const roles = await this.repository.getAllRoles();

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.repository.createUser({
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    };
  }

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await this.repository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri');
    }

    if (!user.is_active)
      throw new UnauthorizedException('Foydalanuvchi faol emas');

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri');
    }

    return await this.makeTokens(user.id, user.token_version);
  }

  async refreshToken(dto: RefreshTokenDto) {
    const user = await this.repository.findByUserRefreshToken(dto.refreshToken);

    if (!user)
      throw new NotFoundException('Foydalanuvchi yoki token topilmadi');

    if (!user.is_active)
      throw new NotFoundException('Foydalanuvchi faol emas');

    return await this.makeTokens(user.id, user.token_version);
  }

  private async makeTokens(userId: number, token_version: number) {
    const refreshToken = randomBytes(64).toString('base64url');
    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const now = Date.now();
    const rTokenExpireAt = new Date(now + this.configService.rTokenPeriodInDays * 86_400_000 /*ms*/);

    const roles = await this.repository.getUserRoles(userId);

    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      roles: roles.map(x => x.name),
      tv: token_version
    });

    await this.cache.set(authTokenVersionKey(userId), token_version);
    await this.repository.updateUserTokens({ userId: userId as number, expire_at: rTokenExpireAt, refreshToken: refreshTokenHash });

    return {
      accessToken,
      refreshToken: refreshTokenHash
    }
  }

  async getUser(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findByIdWithoutPassword(userId);

    if (!user)
      throw new NotFoundException('Foydalanuvchi topilmadi');

    return user!;
  }

  async assignRole(userId: number, dto: AssignRoleDto) {

    const userExistedRoles = await this.repository.getUserRoles(dto.userId);

    if (userExistedRoles.findIndex(x => x.role_id == dto.roleId) !== -1)
      throw new BadRequestException('Foydalanuvchi bu rolga allaqachon ega');

    this.db.transactional(async (pool) => {

      await this.repository.assignRole({
        grantUserId: userId,
        roleId: dto.roleId,
        userId: dto.userId
      }, pool);

      await this.db.increaseTokenVersion(dto.userId, pool);

      this.logger.log('Role assigned', { ...dto, grantUserId: userId });
    })
  }

  async unassignRole(userId: number, dto: AssignRoleDto) {

    const userExistedRoles = await this.repository.getUserRoles(dto.userId);

    if (userExistedRoles.findIndex(x => x.role_id == dto.roleId) === -1)
      throw new BadRequestException('Foydalanuvchida bu rol mavjud emas');


    this.db.transactional(async (pool) => {
      await this.repository.unassignRole({
        roleId: dto.roleId,
        userId: dto.userId
      }, pool);

      await this.db.increaseTokenVersion(dto.userId, pool);

      this.logger.log('Role unassigned', { ...dto, grantUserId: userId });
    })
  }

  async updateUserCredentials(userId: number, dto: UpdateCredentialsDto) {
    const existingUser = await this.repository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Bu email allaqachon mavjud');
    }

    const passwordHash = hashPassword(dto.password);

    await this.repository.updateUserCredentials({
      email: dto.email,
      password_hash: passwordHash,
      updaterId: userId,
      userId: userId
    })
  }

  async logout(userId: number) {
    await this.repository.updateUserTokens({
      userId: userId,
      expire_at: null,
      refreshToken: null
    })
    this.cache.del(authTokenVersionKey(userId));
  }

}