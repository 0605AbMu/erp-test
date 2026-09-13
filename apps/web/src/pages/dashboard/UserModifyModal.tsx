import { useEffect } from 'react';
import { Form, Input, Modal, Switch } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRegex, type UserRow } from '@erp-test/shared';

// const ROLE_OPTIONS = [
//     {
//         label: 'Admin',
//         value: Roles.ADMIN,
//     },
//     {
//         label: 'Payment',
//         value: Roles.PAYMENT,
//     },
//     {
//         label: 'Report',
//         value: Roles.REPORT,
//     },
// ] as const;

const baseUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak')
        .max(50, 'Ko\'pi bilan 50 ta belgidan oshmasligi lozim')
    ,

    surname: z
        .string()
        .trim()
        .min(2, 'Familiya kamida 2 ta belgidan iborat bo‘lishi kerak')
        .max(50, 'Ko\'pi bilan 50 ta belgidan oshmasligi lozim')
    ,

    email: z
        .email("Majburiy"),

    isActive: z.boolean().optional(),
});

const createUserSchema = baseUserSchema.extend({
    password: z
        .string()
        .regex(passwordRegex, 'Kamida 1-8 simvol; 1 ta katta harf A-Z; 1 ta simvol  !,#..; bo’lishi shart')
    ,
})

const updateUserSchema = baseUserSchema.extend({
    password: z
        .string()
        .optional()
    ,
});

export type CreateUserFormValues =
    z.infer<typeof createUserSchema>;

export type UpdateUserFormValues =
    z.infer<typeof updateUserSchema>;

export type UserFormValues =
    | CreateUserFormValues
    | UpdateUserFormValues;

type User = Pick<UserRow, "id" | "name" | "surname" | "email" | "is_active" | "roles">
// {
//     id: number;
//     firstName: string;
//     lastName: string;
//     username: string;
//     roles: UserFormValues['roles'];
//     isActive: boolean;
// };

type UserModalProps = {
    open: boolean;
    user?: User;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (values: UserFormValues & { id?: number }, isEdit: boolean) => void;
};

const defaultValues: UserFormValues = {
    name: '',
    surname: '',
    email: '',
    password: '',
    isActive: true,
};

export function UserModal({
    open,
    user,
    loading = false,
    onClose,
    onSubmit,
}: UserModalProps) {
    const isEdit = Boolean(user);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(!isEdit ? createUserSchema : updateUserSchema),
        defaultValues,
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        if (user) {
            reset({
                name: user.name,
                surname: user.surname,
                email: user.email,
                password: '',
                isActive: user.is_active,
            });

            return;
        }

        reset(defaultValues);
    }, [open, user, reset]);

    const handleFormSubmit = (values: UserFormValues) => {
        onSubmit({ ...values, id: user?.id }, isEdit);
    };

    return (
        <Modal
            open={open}
            title={
                isEdit
                    ? 'Foydalanuvchini tahrirlash'
                    : 'Yangi foydalanuvchi'
            }
            okText={isEdit ? 'Saqlash' : 'Yaratish'}
            cancelText="Bekor qilish"
            confirmLoading={loading}
            onCancel={onClose}
            onOk={handleSubmit(handleFormSubmit)}
            destroyOnHidden
        >
            <Form layout="vertical">
                {/* First name */}
                <Form.Item
                    label="Ism"
                    validateStatus={
                        errors.name ? 'error' : undefined
                    }
                    help={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Ism"
                            />
                        )}
                    />
                </Form.Item>

                {/* Last name */}
                <Form.Item
                    label="Familiya"
                    validateStatus={
                        errors.surname ? 'error' : undefined
                    }
                    help={errors.surname?.message}
                >
                    <Controller
                        name="surname"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Familiya"
                            />
                        )}
                    />
                </Form.Item>

                {/* email */}
                {
                    !isEdit &&
                    <Form.Item
                        label="Email"
                        validateStatus={
                            errors.email ? 'error' : undefined
                        }
                        help={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Elektron pochta"
                                />
                            )}
                        />
                    </Form.Item>
                }

                {
                    !isEdit && <Form.Item
                        label="Parol"
                        validateStatus={
                            errors.password ? 'error' : undefined
                        }
                        help={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input.Password
                                    {...field}
                                    placeholder="parol"

                                />
                            )}
                        />
                    </Form.Item>
                }

                {/* Active */}
                {
                    isEdit && <Form.Item label="Faol">
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </Form.Item>
                }

            </Form>
        </Modal>
    );
}