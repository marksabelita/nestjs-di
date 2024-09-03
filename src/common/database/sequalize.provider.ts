import { IDatabaseProvider } from './database.inteface';
import { ModelCtor, Model } from 'sequelize-typescript';
import { Observable, from, map, switchMap } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SequelizeProvider<
  T extends Model,
  CreateDTO,
  UpdateDTO = Partial<CreateDTO>,
> implements IDatabaseProvider<T, CreateDTO, UpdateDTO>
{
  constructor(private readonly model: ModelCtor<T>) {}

  create(dto: CreateDTO): Observable<T> {
    return from(this.model.create(dto as any));
  }

  update(id: string, dto: UpdateDTO): Observable<T> {
    return from(this.model.findByPk(id)).pipe(
      switchMap((instance) => {
        if (!instance) {
          throw new Error('Entity not found');
        }
        return from(instance.update(dto as any));
      }),
    );
  }

  findAll(filters: Record<string, any> = {}): Observable<T[]> {
    return from(this.model.findAll({ where: filters as any }));
  }

  delete(id: string): Observable<boolean> {
    return from(this.model.destroy({ where: { id } as any })).pipe(
      map((count) => count > 0),
    );
  }

  findOne(id: string): Observable<T | null> {
    return from(this.model.findByPk(id));
  }

  raw<U>(): Observable<U> {
    throw new Error('not implemented');
  }
}
