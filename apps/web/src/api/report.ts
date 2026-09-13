import type { ApiResult, PagedResult, Query } from "@erp-test/shared";
import { api } from "./client";
import { unwrapApiResponse } from "./util";

export async function getAllReports({ ...query }: Query) {
    const response = await api.get<ApiResult<PagedResult<any>>>(
        '/v1/reports',
        { params: query },
    );

    return unwrapApiResponse(response.data);
}

export async function mockReports(count: number) {
    const response = await api.post<ApiResult<any>>(
        '/v1/reports/mock?count=' + count,
        {},
    );

    return unwrapApiResponse(response.data);
}