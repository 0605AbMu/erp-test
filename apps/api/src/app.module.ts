import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { ConfigModule } from './config/config.module.js';
import { DbModule } from './db/db.module.js';
import { UserModule } from './users/users.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { AuthorizationGuard } from './auth/guards/authorization.guard.js';
import { CacheModule, CacheManagerOptions } from '@nestjs/cache-manager';
import { HealthController } from './health/health.module.js';

import { Keyv } from 'keyv';
import { VercelKvStore } from './common/cache/vercel-kv.store.js';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule,
    DbModule,
    AuthModule,
    UserModule,
    PaymentsModule,
    ReportsModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (): CacheManagerOptions => {
        const logger = new Logger('CacheModule');
        const isVercel = Boolean(process.env.VERCEL);
        const hasVercelKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

        if (isVercel && hasVercelKv) {
          logger.log('Using Vercel KV Cache store');
          const store = new VercelKvStore();
          return {
            stores: [new Keyv({ store })],
            ttl: 60_000,
          };
        }

        if (isVercel) {
          logger.warn('Running on Vercel, but KV_REST_API_URL / KV_REST_API_TOKEN not found. Using in-memory cache.');
        } else {
          logger.log('Using in-memory cache for development');
        }

        return {
          ttl: 60_000,
        };
      },
    }),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    }
  ],
})
export class AppModule { }
