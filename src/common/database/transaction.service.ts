// import { Inject, Injectable } from '@nestjs/common';
// import {
//   IDatabaseProvider,
//   IDatabaseTransaction,
//   IDatabaseTransactionProvider,
//   ITransaction,
// } from './database.inteface';
// import { Observable, switchMap, from } from 'rxjs';
// import { ILoggerService } from '../module/logger/logger.interface';
// import { Connection } from 'mongoose';
// import { InjectConnection } from '@nestjs/mongoose';
//
// @Injectable()
// export class DatabaseTransaction implements IDatabaseTransaction {
//   constructor(
//     @Inject(IDatabaseTransactionProvider)
//     private readonly databaseTransactionProvider: IDatabaseTransaction,
//     @Inject(ILoggerService)
//     protected readonly loggerService: ILoggerService,
//   ) {}
//
//   startTransaction(): Observable<ITransaction> {
//     return from(this.databaseTransactionProvider.startTransaction());
//   }
//
//   commitTransaction(transaction: ITransaction): Observable<void> {
//     return from(
//       this.databaseTransactionProvider.commitTransaction(transaction),
//     );
//   }
//
//   rollbackTransaction(transaction: ITransaction): Observable<void> {
//     return from(
//       this.databaseTransactionProvider.rollbackTransaction(transaction),
//     );
//   }
// }
