import './Login.css';

import {
    LockOutlined,
    MailOutlined,
} from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Input
} from 'antd';
import {
    Controller,
    useForm,
} from 'react-hook-form';

import { loginSchema, type LoginForm } from '../../schemas/auth.schema';
import { useAuthStore } from '../../stores/auth.store';
import { loginApi } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginForm) => {
        const response = await loginApi({ email: values.email, password: values.password });
        useAuthStore.getState().setToken(response.accessToken);
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="form-field">
                <label htmlFor="email">
                    Email
                </label>

                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="email"
                            size="large"
                            prefix={<MailOutlined />}
                            placeholder="Enter your email"
                            status={errors.email ? 'error' : undefined}
                            autoComplete="email"
                        />
                    )}
                />

                {errors.email && (
                    <div className="form-error">
                        {errors.email.message}
                    </div>
                )}
            </div>

            {/* Password */}
            <div className="form-field">
                <label htmlFor="password">
                    Password
                </label>

                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            {...field}
                            id="password"
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                            status={
                                errors.password
                                    ? 'error'
                                    : undefined
                            }
                            autoComplete="current-password"
                        />
                    )}
                />

                {errors.password && (
                    <div className="form-error">
                        {errors.password.message}
                    </div>
                )}
            </div>

            <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
            >
                Sign in
            </Button>
        </form>
    );
}