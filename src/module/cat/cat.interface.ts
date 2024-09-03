import { Observable } from 'rxjs';
import { IBaseRepository } from 'src/common/database/database.inteface';
import { CreateDto, UpdateDto } from './dto/create.dto';

export interface ICat {
  id: string;
  name: string;
}

export interface ICatRepository
  extends IBaseRepository<ICat, CreateDto, UpdateDto> {
  create(dto: CreateDto): Observable<ICat>;
  update(id: string, dto: UpdateDto): Observable<ICat>;
  findAll(filters: Record<string, unknown>): Observable<ICat[]>;
  delete(id: string): Observable<boolean>;
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
export const ICatSequalizeProvider = Symbol('ICatSequlizeProvider');
export const ICatMongoProvider = Symbol('ICatMongoProvider');
export const ICatRepository = Symbol('ICatRepository');
