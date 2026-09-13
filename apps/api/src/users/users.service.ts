import {
  BadRequestException,
    Injectable,
    Logger
} from '@nestjs/common';
import { UserRepository } from './users.repository.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { hashPassword } from '../common/utils/password.util.js';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

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
    const updatedUserId = await this.repository.modifyUser({
      user_id: updateUserId,
      name: dto.name,
      surname: dto.surname,
      is_active: dto.is_active,
      update_by_id: userId,
    });

    return await this.repository.findByIdShort(updatedUserId);
  }

  private async checkEmail(email: string){
    const user = await this.repository.findByEmail(email);

    if (!!user && user.id > 0)
      throw new BadRequestException("Email already exists");
  }

  async remove(userId: number){
    await this.repository.removeUser(userId);
  }
}