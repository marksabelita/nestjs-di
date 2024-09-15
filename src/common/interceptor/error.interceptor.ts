import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any) => {
        const request = context.switchToHttp().getRequest();
        const transactionId = request.txId;

        let errorResponse: any = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          transactionId: transactionId,
          message: 'Internal server error',
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        if (error instanceof HttpException) {
          errorResponse.statusCode = error.getStatus();
          errorResponse.message = error.message;
          errorResponse.response = error.getResponse();
        } else if (error instanceof AxiosError) {
          errorResponse.statusCode =
            error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
          errorResponse.message = error.message;
          errorResponse.axiosError = {
            code: error.code,
            config: error.config,
            response: error.response?.data,
          };
        } else if (error instanceof Error) {
          errorResponse.message = error.message;
          errorResponse.stack = error.stack;
        }

        // Include all properties of the original error
        for (const key in error) {
          if (Object.prototype.hasOwnProperty.call(error, key)) {
            errorResponse[key] = error[key];
          }
        }

        // Instead of throwing, return a rejected Observable
        return throwError(() => errorResponse);
      }),
    );
  }
}
