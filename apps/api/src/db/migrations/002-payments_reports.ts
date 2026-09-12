import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('payments', {
    id: {
      type: 'bigserial',
      primaryKey: true,
    },

    user_id: {
      type: 'bigint',
      notNull: true,
      references: 'users(id)',
      onDelete: 'RESTRICT',
    },

    amount: {
      type: 'numeric(18,2)',
      notNull: true,
    },

    currency: {
      type: 'varchar(3)',
      notNull: true,
      default: 'UZS',
    },

    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending',
    },

    method: {
      type: 'varchar(30)',
      notNull: true,
    },

    transaction_id: {
      type: 'varchar(255)',
    },

    description: {
      type: 'text',
    },

    paid_at: {
      type: 'timestamptz',
    },

    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },

    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.createIndex('payments', 'user_id');
  pgm.createIndex('payments', 'status');
  pgm.createIndex('payments', 'transaction_id', {
    unique: true,
  });

  pgm.createTable('reports', {
    id: {
      type: 'bigserial',
      primaryKey: true,
    },

    name: {
      type: 'varchar(255)',
      notNull: true,
    },

    type: {
      type: 'varchar(100)',
      notNull: true,
    },

    created_by: {
      type: 'bigint',
      notNull: true,
      references: 'users(id)',
      onDelete: 'RESTRICT',
    },

    filters: {
      type: 'jsonb',
    },

    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending',
    },

    file_url: {
      type: 'text',
    },

    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },

    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.createIndex('reports', 'created_by');
  pgm.createIndex('reports', 'type');
  pgm.createIndex('reports', 'status');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('reports');
  pgm.dropTable('payments');
}