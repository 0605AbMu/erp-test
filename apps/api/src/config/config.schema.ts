import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

export const envScheme = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    PORT: z.coerce.number().default(4000),

    JWT_SECRET: z.string(),

    DATABASE_URL: z.string(),
})