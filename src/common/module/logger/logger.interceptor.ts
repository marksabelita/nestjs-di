import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ILoggerService } from './logger.interface';

const EXCLUDE_LOGGING_KEY = 'excludeLogging';
export const ExcludeLogging = () => SetMetadata(EXCLUDE_LOGGING_KEY, true);

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private loggerService: ILoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const excludeLogging = this.reflector.get<boolean>(
      EXCLUDE_LOGGING_KEY,
      context.getHandler(),
    );

    if (excludeLogging) {
      return next.handle();
    }

    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    // Log before method execution
    this.loggerService.log(
      { method: `${className}.${methodName}` },
      `Executing ${methodName}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.loggerService.log(
            { method: `${className}.${methodName}`, data },
            `Completed ${methodName}`,
          );
        },
        error: (error) => {
          this.loggerService.error(
            { method: `${className}.${methodName}`, error },
            `Failed ${methodName}`,
          );
        },
      }),
    );
  }
}
