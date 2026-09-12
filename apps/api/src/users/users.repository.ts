import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { UserRow, UserRowFull, UserRowShort } from './users.types.js';

@Injectable()
export class UserRepository {
  constructor(
    private readonly db: DbService,
  ) { }

  async findByIdWithFull(userId: number): Promise<UserRowFull | undefined> {
    return (await this.db.query<UserRowFull>('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId])).rows[0];
  }

  async findByIdWithoutPassword(userId: number): Promise<UserRow | undefined> {
    return (await this.db.query<UserRowFull>('SELECT id, name, surname, email, is_active, created_at, updated_at, updated_by_id, created_by_id FROM users WHERE id = $1 LIMIT 1', [userId])).rows[0];
  }

  async findByIdShort(userId: number): Promise<UserRowShort | undefined> {
    return (await this.db.query<UserRowFull>('SELECT id, name, surname, email, is_active FROM users WHERE id = $1 LIMIT 1', [userId])).rows[0];
  }

}