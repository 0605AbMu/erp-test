import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service.js';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envScheme } from './config.schema.js';

@Global()
@Module({
  imports: [
     NestConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envScheme.parse(env),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
