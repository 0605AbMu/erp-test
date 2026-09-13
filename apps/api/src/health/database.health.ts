import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseHealthIndicator {
    constructor(
        private readonly pool: Pool,
    ) {
    }

    async isHealthy(): Promise<{ database: { status: 'up' | 'down' } }> {
        try {
            await this.pool.query('SELECT 1');

            return { database: { status: 'up' } };
        } catch {
            return { database: { status: 'down' } };
        }
    }
}