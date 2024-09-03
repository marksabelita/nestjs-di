// import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// import { Response, NextFunction } from 'express';
// import { randomUUID } from 'crypto';
// import { HttpLoggerService } from '../module/http-logger/http-logger.service';
// import { EHttpLoggerType } from '../module/http-logger/http-logger.entity';
// import { CustomRequest } from '../interface/http.interface';
//
// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   private logger = new Logger('HTTP');
//
//   constructor(private readonly httpLoggerService: HttpLoggerService) {}
//
//   async use(req: CustomRequest, res: Response, next: NextFunction) {
//     const transactionId = (req.headers['x-transaction-id'] ||
//       randomUUID()) as string;
//     req.txId = transactionId as string;
//     this.logger.log(
//       `[REQUEST] [${req.method}] [ID: ${transactionId}] [URL: ${req.url}]`,
//     ),
//       this.httpLoggerService
//         .create({
//           method: req.method,
//           url: req.url,
//           statusCode: null,
//           contentLength: req.headers['content-length'],
//           userAgent: req.headers['user-agent'],
//           ip: req.ip,
//           request_type: EHttpLoggerType.REQUEST,
//           userId: null,
//           transactionId: transactionId,
//         })
//         .then(() => {});
//
//     res.setHeader('x-transaction-id', transactionId);
//     res.on('finish', () => {
//       this.logger.log(
//         `[] [${req.method}] [ID: ${transactionId}] [URL: ${req.url}] [STATUS: ${res.statusCode}]`,
//       );
//
//       this.httpLoggerService
//         .create({
//           method: req.method,
//           url: req.url,
//           statusCode: res.statusCode,
//           contentLength: req.headers['content-length'],
//           userAgent: req.headers['user-agent'],
//           ip: req.ip,
//           request_type: EHttpLoggerType.RESPONSE,
//           userId: null,
//           transactionId: transactionId,
//         })
//         .then(() => {});
//     });
//
//     next();
//   }
// }
