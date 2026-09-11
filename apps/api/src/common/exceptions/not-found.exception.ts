import { HttpStatus } from '@nestjs/common';
import { ApiException, ApiExceptionOptions } from './api.exception.js';

export class NotFoundException extends ApiException {
  constructor(options: Partial<ApiExceptionOptions> = {}) {
    super({
        code: 'NOT_FOUND',
        message: 'Resource not found',
        statusCode: HttpStatus.NOT_FOUND,
        ...options
    });
  }
}