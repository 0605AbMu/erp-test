import type { ApiResult, PagedResult, Query, UserRow } from "@erp-test/shared";
import { api } from "./client";
import { unwrapApiResponse } from "./util";

export async function getUsers(query: Query): Promise<PagedResult<UserRow>> {
    const response = await api.get<ApiResult<PagedResult<UserRow>>>(
        '/v1/users', { params: query }
    );

    return unwrapApiResponse(response.data);
}

export async function updateUserStatus(userId: number, status: boolean): Promise<any> {
    // const response = await api.get<ApiResult<PagedResult<UserRow>>>(
    //     '/v1/users', { params: query }
    // );

    // return unwrapApiResponse(response.data);
}
