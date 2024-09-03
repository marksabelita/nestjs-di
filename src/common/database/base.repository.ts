// base-repository.ts
import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { IBaseRepository } from './database.inteface';
import { IDatabaseProvider } from 'src/common/database/database.inteface';

@Injectable()
export abstract class BaseRepository<T, CreateDto, UpdateDto>
  implements IBaseRepository<T, CreateDto, UpdateDto>
{
  constructor(
    protected readonly databaseProvider: IDatabaseProvider<
      T,
      CreateDto,
      UpdateDto
    >,
  ) {}

  create(dto: CreateDto): Observable<T> {
    return from(this.databaseProvider.create(dto));
  }

  update(id: string, dto: UpdateDto): Observable<T> {
    return from(this.databaseProvider.update(id, dto));
  }

  findAll(): Observable<T[]> {
    return from(this.databaseProvider.findAll());
  }

  delete(id: string): Observable<boolean> {
    return from(this.databaseProvider.delete(id));
  }

  findOne(id: string): Observable<T> {
    return from(this.databaseProvider.findOne(id));
  }
}
