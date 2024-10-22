import { Observable } from 'rxjs';
import {
  IDatabaseProvider,
  ITransaction,
} from 'src/common/database/database.inteface';
import { CreateLocationDto, UpdateLocationDto } from './location.dto';
export interface ILocation {
  id: string;
  x: string;
  y: string;
}

export interface ILocationService {
  create(data: any): Observable<ILocationResponse>;
  update(): Observable<ILocationResponse>;
  findAll(): Observable<ILocationResponse[]>;
  delete(): Observable<boolean>;
  findOne(): Observable<any>;
}

export interface ILocationRepository
  extends IDatabaseProvider<ILocation, CreateLocationDto, UpdateLocationDto> {
  create(
    dto: CreateLocationDto,
    transaction?: ITransaction,
  ): Observable<ILocation>;
  update(
    id: string,
    dto: UpdateLocationDto,
    transaction?: ITransaction,
  ): Observable<ILocation>;
  findAll(filters: Record<string, unknown>): Observable<ILocation[]>;
  delete(id: string, transaction?: ITransaction): Observable<boolean>;
  findOne(id: string): Observable<ILocation>;
}

export abstract class ILocationResponse {
  id: string;
  x: string;
  y: string;
}

export const ILocationRepository = Symbol('ILocationRepository');
export const ILocationService = Symbol('ILocationService');
export const ILocationDatabaseProvider = Symbol('ILocationDatabaseProvider');
