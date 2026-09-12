import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { ConfigModule } from './config/config.module.js';
import { DbModule } from './db/db.module.js';
import { UserModule } from './users/users.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { ReportsModule } from './reports/reports.module.js';

@Module({
  imports: [ConfigModule, DbModule, AuthModule, UserModule, PaymentsModule, ReportsModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule { }
