import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { PinoLoggerAdapter } from './pino-provider.service';
import { HttpContextService } from '../context/http-context.service';
import { IHttpContextService } from '../context/http-context.interface';
import { ILoggerAdapter, ILoggerService } from './logger.interface';
import { LoggerService } from './logger.service';
import { Request as HttpRequest, Response as HttpResponse } from 'express';
import { HttpStatus } from '@nestjs/common';
import { censorValue, mapPaths } from './logger.utils';

interface HttpErrorObject {
  errorCode: number;
  errorText: string;
  errorData: any;
}

function isHttpErrorObject(err: any): err is HttpErrorObject {
  return (
    err &&
    typeof err.errorCode === 'number' &&
    typeof err.errorText === 'string'
  );
}

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: () => {
        return {
          pinoHttp: {
            level: process.env.LOG_LEVEL || 'info',
            customProps: (req: any, res: any) => {
              return {
                context: 'HTTP',
                transactionId: req.txId,
              };
            },
            transport: {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            },
            // Add the custom configuration here
            base: null,
            redact: {
              paths: mapPaths([]),
              censor: censorValue,
            },
            serializers: {
              req: (req: HttpRequest) => {
                const url = req.url?.split('?');
                return {
                  id: req.id,
                  ip: req.ip,
                  host: req.hostname,
                  method: req.method,
                  url: req.url,
                  path: url?.[0],
                  route: (req as any).routerPath,
                  search: url?.[1],
                  params: req.params,
                  query: req.query,
                  body: req.body,
                };
              },
              res: (res: HttpResponse) => {
                return {
                  code: res.statusCode,
                  text: HttpStatus[res.statusCode],
                };
              },
              err: (err: any) => {
                return {
                  type: err.constructor.name,
                  message: err.message,
                  stack: err.stack,
                  ...err,
                };
                // Ensure we're capturing all properties of the error
                const errorObject: any = {
                  type: err.constructor.name,
                  message: err.message,
                  stack: err.stack,
                };

                // Include all enumerable properties
                for (const key in err) {
                  if (Object.prototype.hasOwnProperty.call(err, key)) {
                    errorObject[key] = err[key];
                  }
                }

                // If there's a response property (common in Axios errors), include its data
                if (err.response && err.response.data) {
                  errorObject.responseData = err.response.data;
                }

                return errorObject;
              },
            },
            mixin: () => {
              return {
                node: {
                  pid: process.pid || undefined,
                  version: process.version?.replace('v', '') || undefined,
                },
              };
            },
          },
        };
      },
    }),
  ],
  providers: [
    { provide: IHttpContextService, useClass: HttpContextService },
    {
      provide: ILoggerAdapter,
      useClass: PinoLoggerAdapter,
    },
    {
      provide: ILoggerService,
      useClass: LoggerService,
    },
  ],
  exports: [ILoggerService, PinoLoggerModule, IHttpContextService],
})
export class LoggerModule {}
