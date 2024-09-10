import { applyDecorators, HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ExceptionResponse,
  getMessage,
} from '../filters/all-exceptions.filter';
import { groupBy } from 'lodash';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ApiExceptions = (...exceptions: HttpException[]) => {
  const exceptionsByStatus = Object.entries(
    groupBy(exceptions, (e) => e.getStatus()),
  );

  const responses = exceptionsByStatus.map(([status, exceptions]) => {
    const statusCode = +status;

    const examples: SchemaObject['examples'] = Object.fromEntries(
      exceptions.map((exception) => {
        const exampleName = exception.constructor.name;

        return [
          exampleName,
          {
            description: getDescription(exception),
            value: {
              statusCode,
              message: getMessage(exception),
            } as ExceptionResponse,
          },
        ];
      }),
    );

    return ApiResponse({
      status: statusCode,
      content: {
        'application/json': {
          examples,
        },
      },
    });
  });

  return applyDecorators(...responses);
};

const getDescription = (exception: HttpException) => {
  const response = exception.getResponse();
  if (typeof response === 'string') {
    return response;
  }
  if (response['error']) {
    return response['error'];
  }
  return response['message'];
};
