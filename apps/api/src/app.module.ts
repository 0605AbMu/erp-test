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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthController } from './health/health.module.js';

@Module({
  imports: [ConfigModule, DbModule, AuthModule, UserModule, PaymentsModule, ReportsModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000, //60s
        limit: 100,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 60_000,
    })

  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
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
