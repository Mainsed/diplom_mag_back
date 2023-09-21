import {
  ArgumentsHost,
  Catch,
  HttpException,
  BadGatewayException,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Extended `HttpExceptionFilter` class for handling http exceptions with user action tracking
 */
@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    const status = exception.getStatus && exception.getStatus();

    const errorResponse = HttpExceptionsFilter.getErrorsResponse(exception);

    response.status(status || errorResponse.getStatus()).json(errorResponse);
  }

  public static getErrorsResponse = (exception: any): HttpException => {
    if (exception instanceof HttpException) {
      return exception;
    }

    return new BadGatewayException(exception.message || 'Unknown error', {
      cause: exception,
    });
  };
}
