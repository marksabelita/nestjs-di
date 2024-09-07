import { ClientSession } from 'mongoose';
import { Observable } from 'rxjs';

export interface IDatabaseProvider<
  T,
  CreateDTO,
  UpdateDTO = Partial<CreateDTO>,
> {
  create(dto: CreateDTO, transaction?: ITransaction): Observable<T>;
  update(id: string, dto: UpdateDTO, transaction?: ITransaction): Observable<T>;
  findAll(filters?: Record<string, any>): Observable<T[]>;
  delete(id: string, transaction?: ITransaction): Observable<boolean>;
  findOne(id: string): Observable<T | null>;
  raw<U>(dto?: Record<string, unknown>): Observable<U>;
  // startTransaction(): Observable<ITransaction>;
  // commitTransaction(transaction: ITransaction): Observable<void>;
  // rollbackTransaction(transaction: ITransaction): Observable<void>;
}

export interface IDatabaseTransaction {
  startTransaction(): Observable<ITransaction>;
  commitTransaction(transaction: ITransaction): Observable<void>;
  rollbackTransaction(transaction: ITransaction): Observable<void>;
}

export interface ITransaction {}
export interface IMongooseTransaction extends ITransaction, ClientSession {}
export const IDatabaseTransactionProvider = Symbol(
  'IDatabaseTransactionProvider',
);

export const IDatabaseTransaction = Symbol('IDatabaseTransaction');
