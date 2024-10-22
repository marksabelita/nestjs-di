import { Observable } from 'rxjs';
import {
  IDatabaseProvider,
  ITransaction,
} from 'src/common/database/database.inteface';
import { CreateDto, UpdateDto } from './dto/create.dto';

export interface ICat {
  id: string;
  name: string;
}

export interface ICatRepository
  extends IDatabaseProvider<ICat, CreateDto, UpdateDto> {
  create(dto: CreateDto, transaction?: ITransaction): Observable<ICat>;
  update(
    id: string,
    dto: UpdateDto,
    transaction?: ITransaction,
  ): Observable<ICat>;
  findAll(filters: Record<string, unknown>): Observable<ICat[]>;
  delete(id: string, transaction?: ITransaction): Observable<boolean>;
  findOne(id: string): Observable<ICat>;
}

export interface ICatService {
  create(data: CreateDto): Observable<ICatResponse>;
  update(id: string, data: UpdateDto): Observable<ICatResponse>;
  findAll(data: Record<string, unknown>): Observable<ICatResponse[]>;
  delete(): Observable<boolean>;
  findOne(): Observable<any>;
}

export interface ICatResponse {
  id: string;
  name: string;
  locations?: any[];
}

export const ICatService = Symbol('ICatService');
export const ICatDatabaseProvider = Symbol('ICatSequlizeProvider');
export const ICatRepository = Symbol('ICatRepository');
export const ICatDatabaseTransactionProvider = Symbol(
  'ICatDatabaseTransactionProvider',
);
