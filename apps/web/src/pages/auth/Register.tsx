import {
    LockOutlined,
    MailOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, notification } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../../api/auth';
import {
    registerSchema,
    type RegisterForm,
} from '../../schemas/auth.schema';

export function Register() {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: RegisterForm) => {
        try {
            await registerApi(values);
            notification.success({
                message: 'Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi',
                description: 'Endi tizimga kirishingiz mumkin.',
            });
            navigate('/login', { replace: true });
        } catch (error: any) {
            notification.error({
                message: 'Ro‘yxatdan o‘tishda xatolik',
                description: error.message,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-field">
                <label htmlFor="name">Ism</label>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="name"
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Ismingizni kiriting"
                            status={errors.name ? 'error' : undefined}
                            autoComplete="given-name"
                        />
                    )}
                />
                {errors.name && <div className="form-error">{errors.name.message}</div>}
            </div>

            <div className="form-field">
                <label htmlFor="surname">Familiya</label>
                <Controller
                    name="surname"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="surname"
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Familiyangizni kiriting"
                            status={errors.surname ? 'error' : undefined}
                            autoComplete="family-name"
                        />
                    )}
                />
                {errors.surname && <div className="form-error">{errors.surname.message}</div>}
            </div>

            <div className="form-field">
                <label htmlFor="email">Elektron pochta</label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="email"
                            size="large"
                            prefix={<MailOutlined />}
                            placeholder="Elektron pochtangizni kiriting"
                            status={errors.email ? 'error' : undefined}
                            autoComplete="email"
                        />
                    )}
                />
                {errors.email && <div className="form-error">{errors.email.message}</div>}
            </div>

            <div className="form-field">
                <label htmlFor="password">Parol</label>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            {...field}
                            id="password"
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Parol yarating"
                            status={errors.password ? 'error' : undefined}
                            autoComplete="new-password"
                        />
                    )}
                />
                {errors.password && <div className="form-error">{errors.password.message}</div>}
            </div>

            <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
            >
                Ro‘yxatdan o‘tish
            </Button>

            <div className="auth-switch">
                Hisobingiz bormi? <Link to="/login">Kirish</Link>
            </div>
        </form>
    );
}