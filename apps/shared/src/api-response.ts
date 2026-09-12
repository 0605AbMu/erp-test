export type PagedResult<T> = {
  items: T[],
  total: number;
}

export type ApiResult<T> =
  {
    statusCode: number
  }
  &
  ({
    success: true;
    data: T
  }
    | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
    });

export const exampleApiResult2xx: ApiResult<any> = {
  data: {},
  statusCode: 200,
  success: true
}

export const exampleApiResult4xx: ApiResult<any> = {
  success: false,
  statusCode: 400,
  error: {
    code: 'ERROR_CODE',
    message: 'human readable error message',
    details: []
  }
}

export const exampleApiResult5xx: ApiResult<any> = {
  success: false,
  statusCode: 500,
  error: {
    code: 'ERROR_CODE',
    message: 'human readable error message',
    details: []
  }
}
