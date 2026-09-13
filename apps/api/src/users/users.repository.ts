import { Injectable, Logger } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { UserRow, UserRowFull, UserRowShort } from '@erp-test/shared';
import { QueryDto } from '../common/dto/query.dto.js';

@Injectable()
export class UserRepository {
  constructor(
    private readonly db: DbService,
  ) { }

  private readonly logger = new Logger(UserRepository.name);

  async findByIdWithFull(userId: number): Promise<UserRowFull | undefined> {
    return (await this.db.query<UserRowFull>('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId])).rows[0];
  }

  async findByIdWithoutPassword(userId: number): Promise<UserRow | undefined> {
    return (await this.db.query<UserRowFull>('SELECT id, name, surname, email, is_active, created_at, updated_at, updated_by_id, created_by_id FROM users WHERE id = $1 LIMIT 1', [userId])).rows[0];
  }

  async findByIdShort(userId: number): Promise<UserRowShort | undefined> {
    return (await this.db.query<UserRowFull>('SELECT id, name, surname, email, is_active FROM users WHERE id = $1 LIMIT 1', [userId])).rows[0];
  }

  async fetchAllUsersWithShort() {
    return (await this.db.query(`SELECT id, name, surname, email, is_active FROM users`)).rows;
  }

  async fetchAllUsers(query: QueryDto) {
    return (await this.db.queryWithPaging(`
      SELECT id, name, surname, email, 
      is_active, created_at, updated_at, 
      updated_by_id, created_by_id, COALESCE(ur.roles, '[]'::jsonb) AS roles
      FROM users u
      LEFT JOIN (
        SELECT ur.user_id,  jsonb_agg(
            jsonb_build_object(
                'role_id', r.id,
                'name', r.name
            )
        ) AS roles
        FROM user_roles ur
        JOIN roles r on r.id = ur.role_id
        GROUP BY ur.user_id
      ) ur on ur.user_id = u.id
      `, query));
  }

  async findByEmail(email: string): Promise<UserRowShort | undefined> {
    const result = await this.db.query(
      `
      SELECT
        id,
        name,
        surname,
        email,
        is_active
      FROM users
      WHERE email ILIKE $1
      LIMIT 1
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  /**
   * Add a user to db
   * @param data 
   * @returns inserted user id
   */
  async addUser(data: {
    name: string;
    surname: string;
    email: string;
    password_hash: string;
    is_active: boolean;
    created_by_id: number;
    update_by_id: number | null;
  }): Promise<number> {
    return Number((await this.db.query(
      `INSERT INTO users 
      (name, surname, email, password_hash, is_active, created_by_id, updated_by_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        data.name,
        data.surname,
        data.email,
        data.password_hash,
        data.is_active,
        data.created_by_id,
        data.update_by_id
      ]
    )).rows[0])
  }

  /**
   * Modify user
   * @param data 
   * @returns updated user id
   */
  async modifyUser(data: {
    user_id: number;
    name: string;
    surname: string;
    is_active: boolean;
    update_by_id: number;
  }): Promise<number> {
    return Number((await this.db.query(
      `UPDATE users SET
        name = $2,
        surname = $3,
        is_active = $4,
        updated_by_id = $5,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id`,
      [
        data.user_id,
        data.name,
        data.surname,
        data.is_active,
        data.update_by_id
      ]
    )).rows[0]?.id)
  }

  async removeUser(userId: number) {
    return Number((await this.db.query(
      `DELETE FROM users u
      WHERE u.id = $1
      RETURNING id`,
      [
        userId
      ]
    )).rows[0]?.id)
  }

}