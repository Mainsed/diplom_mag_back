import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';

import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { inspect } from 'util';

/**
 * Interceptor for logging requests
 * @param journalUserActivityService - service for writing user activity
 */
export class RequestLoggerInterceptor implements NestInterceptor {
  private logger = new Logger(RequestLoggerInterceptor.name);
  constructor(private readonly journalUserActivityService = null) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const requestBody = JSON.stringify({
      query: request.query,
      body: request.body,
    });

    this.logger.log('Request ---> ' + requestBody);

    return next.handle().pipe(
      map((data: any) => {
        this.logger.log('Response <---' + data);
        return data;
      }),
      timeout(5000),
      catchError((error) => {
        this.logger.error(inspect(error));

        if (error instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(error);
      }),
    );
  }
}
