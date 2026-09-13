import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    HealthIndicatorFunction,
} from '@nestjs/terminus';
import { Pool } from 'pg';

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly pool: Pool,
    ) { }

    @Get()
    @HealthCheck()
    check() {
        const databaseCheck: HealthIndicatorFunction = async () => {
            try {
                await this.pool.query('SELECT 1');

                return {
                    database: {
                        status: 'up',
                    },
                };
            } catch {
                return {
                    database: {
                        status: 'down',
                    },
                };
            }
        };

        return this.health.check([
            databaseCheck,
        ]);
    }
}