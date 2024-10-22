import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { PinoLoggerAdapter } from './pino-provider.service';
import { HttpContextService } from '../context/http-context.service';
import { IHttpContextService } from '../context/http-context.interface';
import { ILoggerAdapter, ILoggerService } from './logger.interface';
import { LoggerService } from './logger.service';
import { Request as HttpRequest, Response as HttpResponse } from 'express';
import { HttpStatus } from '@nestjs/common';
import { censorValue, mapPaths } from './logger.utils';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: () => {
        return {
          pinoHttp: {
            level: process.env.ENV !== 'prd' ? 'trace' : 'info',
            customProps: (req: any) => {
              return {
                context: 'HTTP',
                transactionId: req.txId,
              };
            },
            transport: {
              target: 'pino-pretty',
              options: {
                singleLine: process.env.ENV === 'prd' ? true : false,
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
  exports: [ILoggerService, IHttpContextService, ILoggerAdapter],
})
export class LoggerModule {}
