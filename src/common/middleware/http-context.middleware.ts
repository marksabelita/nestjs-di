import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { randomUUID } from 'crypto';
import { CustomRequest } from '../interface/http.interface';
import { IHttpContextService } from '../module/context/http-context.interface';

@Injectable()
export class HttpContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(IHttpContextService)
    private readonly requestContext: IHttpContextService,
  ) {}

  use(req: CustomRequest, res: Response, next: NextFunction) {
    const transactionId = (req.headers['x-transaction-id'] ||
      randomUUID()) as string;
    this.requestContext.setTransactionId(transactionId);
    req.txId = transactionId;
    res.setHeader('x-transaction-id', transactionId);
    next();
  }
}
