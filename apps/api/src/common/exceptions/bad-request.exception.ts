import { HttpStatus } from '@nestjs/common';
import { ApiException, ApiExceptionOptions } from './api.exception.js';

export class BadRequest extends ApiException {
  constructor(options: Partial<ApiExceptionOptions> = {}) {
    super({
    code: 'BAD_REQUEST',
    message: 'bad request',
    statusCode: HttpStatus.BAD_REQUEST,
    ...options
  });
  }
}