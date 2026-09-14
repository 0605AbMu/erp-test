import {
  BadRequestException,
  Injectable,
  Logger
} from '@nestjs/common';
import { UserRepository } from './users.repository.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { hashPassword } from '../common/utils/password.util.js';
import { Cache } from '@nestjs/cache-manager';
import { authTokenVersionKey } from '../common/utils/cache-keys.util.js';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly cache: Cache
  ) { }

  private readonly logger = new Logger(UserService.name)

  async create(userId: number, dto: CreateUserDto) {

    await this.checkEmail(dto.email);

    const passwordHash = hashPassword(dto.password);

    const storedUserId = await this.repository.addUser({
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      is_active: true,
      created_by_id: userId,
      update_by_id: null,
      password_hash: passwordHash
    });

    return await this.repository.findByIdShort(storedUserId);
  }

  async update(userId: number, updateUserId: number, dto: UpdateUserDto) {

    const updatedUser = await this.repository.modifyUser({
      user_id: updateUserId,
      name: dto.name,
      surname: dto.surname,
      is_active: dto.is_active,
      update_by_id: userId,
    });

    await this.cache.set(authTokenVersionKey(updatedUser.id), updatedUser.token_version);

    return await this.repository.findByIdShort(updatedUser.id);
  }

  private async checkEmail(email: string) {
    const user = await this.repository.findByEmail(email);

    if (!!user && user.id > 0)
      throw new BadRequestException('Bu email allaqachon mavjud');
  }

  async remove(authorizedUserId: number, userId: number) {
    if (authorizedUserId == userId)
      throw new BadRequestException('O\' o\'zini o\'chirish mumkin emas');

    await this.repository.removeUser(userId);
    await this.cache.del(authTokenVersionKey(userId));
  }
}