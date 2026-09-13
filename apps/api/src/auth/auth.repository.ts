import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { UserRoles } from '@erp-test/shared';
import { PoolClient } from 'pg';

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
        password_hash,
        is_active
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
    surname: string;
    email: string;
    passwordHash: string;
  }, client: PoolClient | undefined = undefined) {

    const result = await ((client ?? this.db) as PoolClient).query(
      `
      INSERT INTO users (
        name,
        surname,
        email,
        password_hash
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, surname, email
      `,
      [
        data.name,
        data.surname,
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

  async assignRole(data: {
    userId: number;
    grantUserId: number;
    roleId: number;
  }, client: PoolClient | undefined = undefined) {
    return ((client ?? this.db) as PoolClient).query(`
      INSERT INTO user_roles (
        user_id,
        role_id,
        granted_by,
        granted_at
      )
      VALUES ($1, $2, $3, NOW())
      RETURNING user_id, role_id
      `,
      [
        data.userId,
        data.roleId,
        data.grantUserId
      ])
  }

  async unassignRole({ userId, roleId }: {
    userId: number;
    roleId: number;
  }) {

    return this.db.query(`
     DELETE FROM user_roles
     WHERE user_id = $1 AND role_id = $2
     RETURNING user_id, role_id
      `,
      [
        userId,
        roleId
      ])
  }
}