import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) { };
  get databaseUrl(): string {
    return this.config.getOrThrow('DATABASE_URL');
  }

  get port(): number {
    return this.config.get('PORT', 4000);
  }

  get jwtSecret(): {
    secret: string,
    expiresIn: string
  } {
    return {
      secret: this.config.getOrThrow("JWT_SECRET"),
      expiresIn: this.config.get("JWT_EXPIRES_IN", '10d') //for development use,
    };
  }

}
