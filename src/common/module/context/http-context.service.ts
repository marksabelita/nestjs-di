import { Injectable, Scope } from '@nestjs/common';
import { IHttpContextService } from './http-context.interface';

@Injectable({ scope: Scope.REQUEST })
export class HttpContextService implements IHttpContextService {
  private transactionId: string;

  setTransactionId(id: string) {
    this.transactionId = id;
  }

  getTransactionId(): string {
    return this.transactionId || 'NO_TRANSACTION_ID';
  }
}
