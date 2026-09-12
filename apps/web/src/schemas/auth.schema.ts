import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .email('Email noto‘g‘ri formatda'),

    password: z
        .string()
        .min(6, 'Password kamida 6 ta belgidan iborat bo‘lishi kerak'),
});

export type LoginForm = z.infer<typeof loginSchema>;