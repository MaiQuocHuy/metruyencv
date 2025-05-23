import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { format } from 'date-fns';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_METADATA } from '../decorators/response-message.decorator';
import { v4 as uuidv4 } from 'uuid';
import { Logging } from '../logger/mylogger.log';
import Util from '@common/services/util.service';
export type Response<T> = {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  metadata: T;
  option: object;
  timestamp: string;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private readonly logger = new Logging().getLogger();
  private util: Util;
  // eslint-disable-next-line prettier/prettier
  constructor(private reflector: Reflector) {
    this.util = new Util();
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'];
    request.requestId = requestId ? requestId : uuidv4();
    this.logger.log({
      level: 'info',
      context: request.path,
      message: `input params ::${request.method}`,
      refCode: request.requestId,
      metadata: request.method === 'POST' ? request.body : request.query,
    });

    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: unknown) => {
        // Check if the error is an instance of HttpException
        if (err instanceof HttpException) {
          // Handle HttpException using your custom errorHandler
          return throwError(() => this.errorHandler(err, context));
        } else {
          // Re-throw non-HttpException errors so they are handled by global filters
          return throwError(() => err);
        }
      }),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'];
    request.requestId = requestId ? requestId : uuidv4();
    this.logger.error({
      level: 'error',
      message: exception.message ? exception.message : response,
      err: exception,
      context: request.path,
      refCode: request.requestId,
      statusCode: exception.getStatus() || 500,
    });
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.message,
      result:
        process.env.NODE_ENV === 'production'
          ? 'An error occurred'
          : this.util.formatStackTrace((exception as Error).stack || exception),
      option: {},
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode;
    const statusReason = HttpStatus[statusCode] || 'Unknown Status';

    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) || 'success';

    return {
      status: true,
      path: request.url,
      statusCode,
      statusReason,
      message: message,
      metadata: res.metadata,
      option: res.option || {},
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    };
  }
}
