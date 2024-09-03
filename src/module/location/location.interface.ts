import { Observable } from 'rxjs';

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

export abstract class ILocationResponse {
  id: string;
  x: string;
  y: string;
}

export const ILocationService = Symbol('ILocationService');
export const ILocationService2 = Symbol('ILocationService2');

export const ILocationSequalizeProvider = Symbol('ILocationDatabaseProvider');
