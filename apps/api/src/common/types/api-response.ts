import { HttpStatus } from "@nestjs/common";

export type ApiResult<T> =
  {
    statusCode: HttpStatus
  }
  &
  ({
    success: true;
    data: T;
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
  statusCode: HttpStatus.OK,
  success: true
}

export const exampleApiResult4xx: ApiResult<any> = {
  success: false,
  statusCode: HttpStatus.BAD_REQUEST,
  error: {
    code: 'ERROR_CODE',
    message: 'human readable error message',
    details: []
  }
}

export const exampleApiResult5xx: ApiResult<any> = {
  success: false,
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  error: {
    code: 'ERROR_CODE',
    message: 'human readable error message',
    details: []
  }
}