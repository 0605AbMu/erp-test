import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({})
export class ConditionalThrottlerModule {
  static async forRoot(): Promise<DynamicModule> {
    if (process.env.VERCEL) {
      return {
        module: ConditionalThrottlerModule,
      };
    }

    const { ThrottlerModule, ThrottlerGuard } = await import('@nestjs/throttler');

    return {
      module: ConditionalThrottlerModule,
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'default',
            ttl: 60_000,
            limit: 100,
          },
        ]),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
      exports: [ThrottlerModule],
    };
  }
}
