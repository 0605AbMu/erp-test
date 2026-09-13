import type { ApiResult, PagedResult, Query, UserRow } from "@erp-test/shared";
import { api } from "./client";
import { unwrapApiResponse } from "./util";

export async function getUsers(query: Query): Promise<PagedResult<UserRow>> {
    const response = await api.get<ApiResult<PagedResult<UserRow>>>(
        '/v1/users', { params: query }
    );

    return unwrapApiResponse(response.data);
}

export async function updateUser({ userId, name, surname, is_active }:
    { userId: number; name: string; surname: string; is_active: boolean }): Promise<any> {
    const response = await api.put<ApiResult<any>>(
        '/v1/users/' + userId, { name, surname, is_active }
    );

    return unwrapApiResponse(response.data);
}

export async function createUser({ ...data }: {
    name: string;
    surname: string;
    email: string;
    password: string
}) {
    const response = await api.post<ApiResult<any>>(
        '/v1/users/', data
    );

    return unwrapApiResponse(response.data);
}

export async function deleteUser(userId: number) {
    const response = await api.delete<ApiResult<any>>(
        '/v1/users/' + userId
    );

    return unwrapApiResponse(response.data);
}
