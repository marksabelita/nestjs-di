import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { randomUUID } from 'crypto';
import { IHttpContextService } from '../module/context/http-context.interface';
import { ICustomRequest } from './http-context.interface';

@Injectable()
export class HttpContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(IHttpContextService)
    private readonly requestContext: IHttpContextService,
  ) {}

  use(req: ICustomRequest, res: Response, next: NextFunction): void {
    const transactionId = (req.headers['x-transaction-id'] ||
      randomUUID()) as string;
    this.requestContext.setTransactionId(transactionId);
    req.txId = transactionId;
    res.setHeader('x-transaction-id', transactionId);
    next();
  }
}
