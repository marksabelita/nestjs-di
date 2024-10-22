import { Injectable } from '@nestjs/common';
import { from, map, Observable, switchMap } from 'rxjs';
import { IDatabaseProvider, IMongooseTransaction } from './database.inteface';
import { ClientSession, Connection, Model, mongo } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class MongoDBProvider<T, CreateDTO, UpdateDTO = Partial<CreateDTO>>
  implements IDatabaseProvider<T, CreateDTO, UpdateDTO>
{
  constructor(
    private readonly model: Model<T>,
    // @InjectConnection() private readonly connection: Connection,
  ) {}

  create(dto: CreateDTO, session?: IMongooseTransaction): Observable<T> {
    if (session) {
      return from(this.model.create([dto], { session: session })).pipe(
        map((results) => {
          if (!results || results.length === 0) {
            throw new Error('Failed to create document');
          }
          return results[0] as T;
        }),
      );
    } else {
      return from(this.model.create(dto)).pipe(map((result) => result as T));
    }
  }

  update(
    id: string,
    dto: UpdateDTO,
    session: IMongooseTransaction,
  ): Observable<T> {
    return from(
      this.model.findByIdAndUpdate(id, dto, { new: true, session }),
    ).pipe(map((result) => result as T));
  }

  findAll(): Observable<T[]> {
    return from(this.model.find().lean().exec()).pipe(
      map((documents) => documents.map((doc) => doc as T)),
    );
  }

  delete(id: string, session: IMongooseTransaction): Observable<boolean> {
    return from(this.model.findByIdAndDelete(id, { session })).pipe(
      map((result) => !!result),
    );
  }

  findOne(id: string): Observable<T | null> {
    return from(this.model.findById(id).lean().exec()).pipe(
      map((result) => result as T),
    );
  }

  raw<U>(): Observable<U> {
    throw new Error('not implementated');
  }

  // private createMongooseTransaction(
  //   session: ClientSession,
  // ): IMongooseTransaction {
  //   return session;
  // }

  // startTransaction(
  //   options?: mongo.TransactionOptions,
  // ): Observable<IMongooseTransaction> {
  //   return from(this.connection.startSession()).pipe(
  //     switchMap((session: ClientSession) => {
  //       session.startTransaction(options);
  //       return from(Promise.resolve(this.createMongooseTransaction(session)));
  //     }),
  //   );
  // }
  //
  // commitTransaction(transaction: IMongooseTransaction): Observable<void> {
  //   return from(transaction.commitTransaction()).pipe(
  //     switchMap(() => from(transaction.endSession())),
  //   );
  // }
  //
  // rollbackTransaction(transaction: IMongooseTransaction): Observable<void> {
  //   return from(transaction.abortTransaction()).pipe(
  //     switchMap(() => from(transaction.endSession())),
  //   );
  // }
}
