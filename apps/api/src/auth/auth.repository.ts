import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { UserRoles } from './auth.types.js';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly db: DbService,
  ) { }

  async findByEmail(email: string) {
    const result = await this.db.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash
      FROM users
      WHERE email ILIKE $1
      LIMIT 1
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    const result = await this.db.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING id, name, email
      `,
      [
        data.name,
        data.email,
        data.passwordHash,
      ],
    );

    return result.rows[0];
  }

  async getAllRoles() {
    const roles = (await this.db.query('SELECT id, name FROM roles')).rows; //ensure pagination doesn't required
    return roles;
  }

  async getUserRoles(userId: number) {
    return (await this.db.query<UserRoles>(`
      SELECT ur.user_id, ur.role_id, r.name from user_roles ur
      JOIN roles r on r.id = ur.role_id
      WHERE ur.user_id = $1
      `, [userId])).rows;
  }
}