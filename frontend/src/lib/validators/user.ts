import { z } from "zod";

export const UserFields = {
    id: z.number().positive(),
    email: z
        .string({ message: 'Вы не указали электронную почту!' })
        .email('Некорректный адрес электронной почты'),
    password: z
        .string({ message: 'Вы не указали пароль!' })
        .min(8, 'Слишком короткий пароль')
        .max(32, 'Слишком длинный пароль'),
    firstName: z.string({ message: 'Вы не указали имя!' }).max(64, "Слишком длинное имя"),
    lastName: z.string({ message: 'Вы не указали фамилию!' }).max(64, "Слишком длинная фамилия"),
} as const;