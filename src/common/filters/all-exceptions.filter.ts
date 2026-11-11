import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = null;

    const isProduction = process.env.NODE_ENV === 'production';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || message;
        errors = resp.errors || null;
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled exception on ${request.method} ${request.url}: ${exception.message}`, exception.stack);
      message = isProduction ? 'Une erreur interne est survenue.' : exception.message;
    } else {
      this.logger.error(`Unknown exception on ${request.method} ${request.url}: ${String(exception)}`);
      message = 'Une erreur interne est survenue.';
    }

    // Mask sensitive 500 error messages in production
    if (isProduction && status >= 500) {
      message = 'Une erreur interne est survenue.';
      errors = null;
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
