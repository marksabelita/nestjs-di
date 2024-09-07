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
                // if (!(res as any).sent) return;
                // console.log(res);

                return {
                  code: res.statusCode,
                  text: HttpStatus[res.statusCode],
                  // time: Math.round((res as any).getResponseTime()),
                  // transactionId: res.header('x-transaction-id'),
                };
              },
              err: (err: HttpErrorObject) => {
                if (!isHttpErrorObject(err)) return err;

                return {
                  code: err.errorCode,
                  text: err.errorText,
                  data: err.errorData,
                };
              },
            },
            mixin: () => {
              // This function would typically access request-specific data
              // For demonstration, we're returning a static object
              return {
                node: {
                  pid: process.pid || undefined,
                  version: process.version?.replace('v', '') || undefined,
                },
                auth: {
                  apiKey: undefined,
                  bearerToken: undefined,
                },
                user: {
                  oktaUserId: undefined,
                  argoUserId: undefined,
                  synapseUserId: undefined,
                  experianUserId: undefined,
                  fingerprint: undefined,
                  role: undefined,
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
