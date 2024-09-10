import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export interface ExceptionResponse {
  statusCode: number;
  message: string;
}

export const getMessage = (exception: HttpException) => {
  const response = exception.getResponse();
  if (typeof response === 'string') {
    return response;
  }
  if (response['message']) {
    if (response['message'] instanceof Array) {
      return response['message'][0];
    }
    return response['message'];
  }
  return response['error'];
};

// Centralized exception handling
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<ExceptionResponse>>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? getMessage(exception)
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
