import type { Pool } from 'pg';
import {Roles} from '@erp-test/shared';

export async function seedRoles(pool: Pool): Promise<void> {
  const roles = Object.values(Roles);

  const placeholders = roles
    .map((_, index) => `($${index + 1})`)
    .join(', ');

  await pool.query(
    `
      INSERT INTO roles (name)
      VALUES ${placeholders}
      ON CONFLICT (lower(name)) DO NOTHING
    `,
    roles,
  );
}