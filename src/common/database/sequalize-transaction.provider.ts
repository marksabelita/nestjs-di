import { defer, Observable } from 'rxjs';
import { IDatabaseTransaction, ITransaction } from './database.inteface';
import { Sequelize, Transaction } from 'sequelize';
import { Inject, Injectable } from '@nestjs/common';

export interface ISequalizeTransaction extends ITransaction, Transaction {}

@Injectable()
export class SequelizeTransactionProvider implements IDatabaseTransaction {
  constructor(private sequelize: Sequelize) {}

  startTransaction(): Observable<ISequalizeTransaction> {
    return defer(() =>
      this.sequelize.transaction(),
    ) as Observable<ISequalizeTransaction>;
  }

  commitTransaction(transaction: ISequalizeTransaction): Observable<void> {
    return defer(() => transaction.commit());
  }

  rollbackTransaction(transaction: ISequalizeTransaction): Observable<void> {
    return defer(() => transaction.rollback());
  }
}
