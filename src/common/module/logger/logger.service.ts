import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { ILoggerAdapter, ILoggerService } from './logger.interface';
import { IHttpContextService } from '../context/http-context.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILoggerService {
  constructor(
    @Inject(INQUIRER) private parentClass: object,
    @Inject(ILoggerAdapter) private readonly baseLogger: ILoggerAdapter,
    @Inject(IHttpContextService)
    private readonly requestContext: IHttpContextService,
  ) {}

  private getTransactionId(): string {
    return this.requestContext.getTransactionId();
  }

  private getContext(): string {
    return this.parentClass.constructor.name;
  }

  private getLogObject(message: string | object, context?: string) {
    return {
      transactionId: this.getTransactionId(),
      context: context || this.getContext(),
      message: typeof message === 'string' ? message : JSON.stringify(message),
    };
  }

  log(message: string | object, context?: string) {
    this.baseLogger.info(this.getLogObject(message, context));
  }

  error(message: string | object, trace?: string, context?: string) {
    this.baseLogger.error(this.getLogObject(message, context), trace);
  }

  warn(message: string | object, context?: string) {
    this.baseLogger.warn(this.getLogObject(message, context));
  }

  debug(message: string | object, context?: string) {
    this.baseLogger.debug(this.getLogObject(message, context));
  }

  verbose(message: string | object, context?: string) {
    this.baseLogger.trace(this.getLogObject(message, context));
  }
}
