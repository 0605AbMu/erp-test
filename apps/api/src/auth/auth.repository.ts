import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { Session, UserRoles } from '@erp-test/shared';
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
        is_active,
        token_version
      FROM users
      WHERE email ILIKE $1
      LIMIT 1
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async findByUserId(userId: number) {
    const result = await this.db.query(
      `
      SELECT
        id,
        name,
        email,
        is_active,
        token_version,
        r_token,
        expire_at
      FROM users
      WHERE id = $1 and is_active
      LIMIT 1
      `,
      [userId],
    );

    return result.rows[0] as {
      id: number;
      name: string;
      email: string;
      is_active: boolean;
      token_version: number;
      r_token?: string;
      expire_at?: Date;
    } ?? null;
  }

  async findByUserRefreshToken(token: string) {
    const result = await this.db.query(
      `
      SELECT
        id,
        name,
        email,
        is_active,
        token_version,
        r_token,
        expire_at
      FROM users
      WHERE r_token = $1 and expire_at > NOW()
      LIMIT 1
      `,
      [token],
    );

    return result.rows[0] as {
      id: number;
      name: string;
      email: string;
      is_active: boolean;
      token_version: number;
      r_token?: string;
      expire_at?: Date;
    } ?? null;
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
  }, client: PoolClient | undefined = undefined) {

    return ((client ?? this.db) as PoolClient).query(`
     DELETE FROM user_roles
     WHERE user_id = $1 AND role_id = $2
     RETURNING user_id, role_id
      `,
      [
        userId,
        roleId
      ])
  }


  /**
   * Modify user
   * @param data 
   * @returns updated user id
   */
  async updateUserCredentials({ userId, email, password_hash, updaterId }: {
    userId: number;
    email: string;
    password_hash: string;
    updaterId: number;
  }) {
    return (await this.db.query(
      `UPDATE users SET
        email = $2
        password_hash = $4,
        updated_by_id = $6,
        updated_at = NOW(),
        token_version = token_version + 1
      WHERE id = $1, token_version
      RETURNING id`,
      [
        userId,
        email,
        password_hash,
        updaterId
      ]
    )).rows[0] as { id: number; token_version: number }
  }

  async updateUserTokens({ userId, refreshToken, expire_at }: {
    userId: number;
    refreshToken: string | null;
    expire_at: Date | null;
  }, client: PoolClient | undefined = undefined) {
    return (await ((client ?? this.db) as PoolClient).query(
      `UPDATE users SET
        r_token = $2,
        expire_at = $3,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id`,
      [
        userId,
        refreshToken,
        expire_at,
      ]
    )).rows[0] as { id: number; }
  }

  // async addSession({ ...data }: Omit<Session, 'id' | 'created_at' | 'revoked_at'>): Promise<Pick<Session, 'id' | 'created_at'>> {
  //   const result = await this.db.query(
  //     `
  //     INSERT INTO sessions (
  //       user_id,
  //       refresh_token_hash,
  //       user_agent,
  //       ip
  //     )
  //     VALUES ($1, $2, $3, $4)
  //     RETURNING id, created_at
  //     `,
  //     [
  //       data.user_id,
  //       data.refresh_token_hash,
  //       data.user_agent,
  //       data.ip,
  //     ],
  //   );

  //   return result.rows[0];
  // }

  // async updateSession({ ...data }: Pick<Session, 'id' | 'revoked_at' | 'user_agent' | 'ip' | 'last_used_at'>) {
  //   return (await this.db.query(
  //     `UPDATE sessions SET
  //       revoked_at = $2
  //       last_used_at = $3,
  //       user_agent = $4,
  //       ip = $5
  //     WHERE id = $1
  //     RETURNING id`,
  //     [
  //       data.id,
  //       data.revoked_at,
  //       data.last_used_at,
  //       data.user_agent,
  //       data.ip
  //     ]
  //   )).rows[0]?.id as string;
  // }

  // async findSessionById(id: string) {
  //   return (await this.db.query<Session>(`
  //     SELECT * FROM sessions
  //     WHERE id = $1 LIMIT 1
  //     `,
  //     [id])).rows[0];
  // }

}