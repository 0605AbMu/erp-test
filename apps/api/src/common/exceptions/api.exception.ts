
import { HttpException, HttpStatus } from '@nestjs/common';

export interface ApiExceptionOptions {
  code: string;
  message: string;
  statusCode: HttpStatus;
  details?: unknown;
}

export class ApiException extends HttpException {
  readonly code: string;
  readonly details?: unknown;

  constructor(options: ApiExceptionOptions) {
    super(
      {
        code: options.code,
        message: options.message,
      },
      options.statusCode,
    );

    this.code = options.code;
    this.details = options.details;
  }

  get statusCode(): number {
    return this.getStatus();
  }

  get errorMessage(): string {
    return this.message;
  }
}