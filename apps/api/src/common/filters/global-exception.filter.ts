import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiException } from '../exceptions/api.exception.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.error(exception);
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    if (exception instanceof ApiException) {
      response.status(exception.statusCode).json({
        success: false,
        status: exception.statusCode,
        error: {
          code: exception.code,
          message: exception.message,
          details: exception.details,
        },
      });

      return;
    }

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        success: false,
        status: exception.getStatus(),
        error: {
          code: 'HTTP_ERROR',
          message: exception.message,
        },
      });

      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ichki server xatosi',
      },
    });
  }
}