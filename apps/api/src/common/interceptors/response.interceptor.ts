import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { ApiResult } from '../types/api-response.js';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResult<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResult<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: HttpStatus.OK,
        data,
      })),
    );
  }
}