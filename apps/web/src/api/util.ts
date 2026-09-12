import type { ApiResult } from "@erp-test/shared";

export function unwrapApiResponse<T>(result: ApiResult<T>) {
    if (!result.success) {
        throw new Error(result.error.message);
    }

    return result.data;
}