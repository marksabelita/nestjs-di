import { Observable } from 'rxjs';

export interface IDatabaseProvider<
  T,
  CreateDTO,
  UpdateDTO = Partial<CreateDTO>,
> {
  create(dto: CreateDTO): Observable<T>;
  update(id: string, dto: UpdateDTO): Observable<T>;
  findAll(filters?: Record<string, any>): Observable<T[]>;
  delete(id: string): Observable<boolean>;
  findOne(id: string): Observable<T | null>;
  raw<U>(dto?: Record<string, unknown>): Observable<U>;
}

export interface IBaseRepository<T, CreateDto, UpdateDto> {
  create(dto: CreateDto): Observable<T>;
  update(id: string, dto: UpdateDto): Observable<T>;
  findAll(filters: Record<string, unknown>): Observable<T[]>;
  delete(id: string): Observable<boolean>;
  findOne(id: string): Observable<T>;
}
