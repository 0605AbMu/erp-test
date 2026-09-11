// 001-create-roles.ts

import type { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder) {
  pgm.createTable('roles', {
    id: {
      type: 'bigserial',
      primaryKey: true,
    },
    name: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },
  });


  pgm.createTable('users', {
    id: {
      type: 'bigserial',
      primaryKey: true,
    },
    name: {
      type: 'varchar(55)',
      notNull: true,
    },
    surname: {
      type: 'varchar(55)',
      notNull: true,
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },

    is_active: {
      type: 'bool',
      notNull: true,
      default: true,
    },

    password_hash: {
      type: 'text',
      notNull: true,
    },

    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },

    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },

    created_by_id: {
      type: 'bigint',
      references: 'users',
      onDelete: 'CASCADE',
    },

    updated_by_id: {
      type: 'bigint',
      references: 'users',
      onDelete: 'CASCADE',
    },

  });

  pgm.createIndex('users', 'created_by_id');
  pgm.createIndex('users', 'updated_by_id');


  pgm.createTable('user_roles', {
    user_id: {
      type: 'bigint',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },

    role_id: {
      type: 'bigint',
      notNull: true,
      references: 'roles',
      onDelete: 'CASCADE',
    },

    granted_by: {
      type: 'bigint',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },

    granted_at: {
        type: 'timestamptz',
        notNull: true,
      }
  });

  pgm.addConstraint('user_roles', 'pk_user_roles', {
    primaryKey: ['user_id', 'role_id'],
  });

  pgm.createIndex('user_roles', 'role_id');

}

export function down(pgm: MigrationBuilder) {
  pgm.dropTable('user_roles');
  pgm.dropTable('users');
  pgm.dropTable('roles');
}