import { Observable } from 'rxjs';

export interface IEntityRepository<T> {
  create(data: any): Observable<T>;
  update(): Observable<T>;
  findAll(): Observable<T[]>;
  delete(): Observable<boolean>;
  findOne(): Observable<T>;
}
