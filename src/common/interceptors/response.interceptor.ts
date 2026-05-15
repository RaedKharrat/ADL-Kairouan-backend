import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // If data already has our response shape, pass through
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Handle paginated responses
        let meta: Record<string, unknown> | undefined;
        let payload = data;

        if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
          meta = data.meta as Record<string, unknown>;
          payload = data.items;
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message: 'Success',
          data: payload,
          ...(meta && { meta }),
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
