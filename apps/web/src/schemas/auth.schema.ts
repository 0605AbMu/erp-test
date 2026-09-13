import { z } from 'zod';
import { nameRegex, passwordRegex } from '@erp-test/shared';

export const loginSchema = z.object({
    email: z
        .email('Email noto‘g‘ri formatda'),

    password: z
        .string()
        .min(6, 'Password kamida 6 ta belgidan iborat bo‘lishi kerak'),
});

export type LoginForm = z.infer<typeof loginSchema>;

const nameField = (label: string) => z
    .string()
    .trim()
    .min(2, `${label} kamida 2 ta belgidan iborat bo‘lishi kerak`)
    .max(50, `${label} 50 ta belgidan oshmasligi kerak`)
    .regex(nameRegex, `${label} faqat harflardan iborat bo‘lishi kerak`);

export const registerSchema = z.object({
    name: nameField('Ism'),
    surname: nameField('Familiya'),
    email: z.email('Email noto‘g‘ri formatda'),
    password: z.string().regex(
        passwordRegex,
        'Parol kamida 8 belgidan iborat bo‘lib, katta harf, kichik harf, raqam va maxsus belgini o‘z ichiga olishi kerak',
    ),
});

export type RegisterForm = z.infer<typeof registerSchema>;