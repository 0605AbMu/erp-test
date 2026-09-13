import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import type { ApiResult } from '@erp-test/shared';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResult<T>> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResult<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<{
      method: string;
      originalUrl?: string;
      url: string;
    }>();
    const response = httpContext.getResponse<{ status: (code: number) => void; statusCode: number }>();
    const startedAt = Date.now();

    response.status(HttpStatus.OK);

    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        statusCode: HttpStatus.OK,
        data,
      })),
      tap({
        next: () => {
          this.logRequest(request, response.statusCode, startedAt);
        },
        error: (error: unknown) => {
          const status = error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

          this.logRequest(request, status, startedAt);
        },
      }),
    );
  }

  private logRequest(
    request: { method: string; originalUrl?: string; url: string },
    status: number,
    startedAt: number,
  ): void {
    const path = request.originalUrl ?? request.url;
    const duration = Date.now() - startedAt;
    this.logger.log(`${request.method} ${path} ${status} ${duration}ms`);
  }
}