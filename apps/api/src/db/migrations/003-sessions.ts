import type { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder) {
    pgm.addColumns('users', {
        r_token: {
            type: 'text',
        },
        expire_at: {
            type: 'timestamptz'
        },
        token_version: {
            type: 'int',
            default: 1
        }
    })

    pgm.createIndex('users', 'r_token');
}

export function down(pgm: MigrationBuilder) {
    pgm.dropColumns('users', ['r_token', 'expire_at', 'token_version']);
}