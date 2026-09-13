// api/auth.ts

import type { ApiResult, UserResponse } from '@erp-test/shared';
import type { LoginForm } from '../schemas/auth.schema';
import { api } from './client';
import { unwrapApiResponse } from './util';

interface LoginResponse {
    accessToken: string;
}

export async function loginApi(
    data: LoginForm,
): Promise<LoginResponse> {
    const response = await api.post<ApiResult<LoginResponse>>(
        '/v1/auth/login',
        data,
    );

    return unwrapApiResponse(response.data);
}

export async function getMe(): Promise<UserResponse> {
    const response = await api.get<ApiResult<UserResponse>>(
        '/v1/auth/me');

    return unwrapApiResponse(response.data);
}


export async function removeUserRole(userId: number, roleId: number): Promise<any> {
    const response = await api.post(
        '/v1/auth/unassign-role', { userId, roleId }
    );

    return unwrapApiResponse(response.data);
}

export async function assignRole(userId: number, roleId: number): Promise<any> {
    const response = await api.post(
        '/v1/auth/assign-role', { userId, roleId }
    );

    return unwrapApiResponse(response.data);
}


export async function getAllRoles(): Promise<any> {
    const response = await api.get<ApiResult<[]>>(
        '/v1/auth/roles'
    );

    return unwrapApiResponse(response.data);
}
