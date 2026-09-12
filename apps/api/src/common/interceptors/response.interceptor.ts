import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { ApiResult } from '@erp-test/shared';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResult<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResult<T>> {
    const response = context.switchToHttp().getResponse();
    response.status(200);
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: HttpStatus.OK,
        data,
      })),
    );
  }
}