import { HttpStatus } from '@nestjs/common';
import { ApiException, ApiExceptionOptions } from './api.exception.js';

export class InternalServerErrorException extends ApiException {
  constructor(options: Partial<ApiExceptionOptions> = {}) {
    super({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ichki server xatosi',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        ...options
    });
  }
}