/* eslint-disable prefer-const */
import { Logging } from '@common/logger/mylogger.log';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseError, Error, UniqueConstraintError } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Util from '@common/services/util.service';
import { format } from 'date-fns';

@Catch(BaseError)
export class DatabaseExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logging().getLogger();
  private util: Util;
  // eslint-disable-next-line prettier/prettier
  constructor() {
    this.util = new Util();
  }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // Default error values
    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500
    let message = exception.message || 'A database error occurred';
    // JSON.stringify(exception.errors, null, 2)
    const requestId = request.headers['x-request-id'];
    request.requestId = requestId ? requestId : uuidv4();
    this.logger.error({
      level: 'error',
      message: `${message}::[${exception.name}]`,
      err: exception,
      context: request.path,
      refCode: request.requestId,
      statusCode: status,
      option: '',
    });

    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: `${message}::[${exception.name}]`,
      result:
        process.env.NODE_ENV === 'production'
          ? 'An error occurred'
          : this.util.formatStackTrace((exception as Error).stack || exception),
      // option: {
      //   exception:
      //     process.env.NODE_ENV === 'production' ? '' : exception.errors,
      // },
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    });
  }
}
