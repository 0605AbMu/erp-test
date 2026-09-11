import {
    Injectable
} from '@nestjs/common';
import { UserRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  async create(dto: CreateUserDto) {
    // Implement user creation logic here, e.g., validation, hashing passwords, etc.
    // return this.repository.create(dto);
  }
}