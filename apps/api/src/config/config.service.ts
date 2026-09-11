import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get databaseUrl(): string {
    return process.env.DATABASE_URL!;
  }

  get port(): number {
    return Number(process.env.PORT ?? 3000);
  }

  get jwtSecret(): {
    secret: string,
    expiresIn: string
  } {
    return {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    };
  }

}
