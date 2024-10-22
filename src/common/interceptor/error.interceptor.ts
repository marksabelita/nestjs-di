import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

@Catch()
export class ErrorInterceptor implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof Error ? exception.message : 'Unknown error';
    const errorStack = exception instanceof Error ? exception.stack : '';
    const path = httpAdapter.getRequestUrl(request);

    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path,
    };

    this.logger.error({
      message: errorMessage,
      statusCode: httpStatus,
      path: responseBody.path,
      method: request.method,
      body: request.body,
      params: request.params,
      query: request.query,
      stack: errorStack,
      context: 'ExceptionFilter',
      transactionId: request.txId,
    });

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
