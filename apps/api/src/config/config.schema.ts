import { z } from 'zod';

export const envScheme = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    PORT: z.coerce.number().default(4000),

    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().optional(),

    DATABASE_URL: z.string(),
})