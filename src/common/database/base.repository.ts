// base-repository.ts
import { Inject, Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { ITransaction } from './database.inteface';
import { IDatabaseProvider } from 'src/common/database/database.inteface';
import { ILoggerService } from '../module/logger/logger.interface';

@Injectable()
export abstract class BaseRepository<T, CreateDto, UpdateDto>
  implements IDatabaseProvider<T, CreateDto, UpdateDto>
{
  constructor(
    protected readonly databaseProvider: IDatabaseProvider<
      T,
      CreateDto,
      UpdateDto
    >,
    @Inject(ILoggerService)
    protected readonly loggerService: ILoggerService,
  ) {}

  raw<U>(dto?: Record<string, unknown>): Observable<U> {
    this.loggerService.log({ dto }, 'rawRepository');

    throw new Error('Method not implemented.');
  }

  create(dto: CreateDto, transaction: ITransaction): Observable<T> {
    this.loggerService.log({ dto }, 'createRepository');

    return from(this.databaseProvider.create(dto, transaction));
  }

  update(id: string, dto: UpdateDto, transaction: ITransaction): Observable<T> {
    this.loggerService.log({ dto }, 'updateRepository');

    return from(this.databaseProvider.update(id, dto));
  }

  findAll(): Observable<T[]> {
    return from(this.databaseProvider.findAll());
  }

  delete(id: string, transaction: ITransaction): Observable<boolean> {
    return from(this.databaseProvider.delete(id, transaction));
  }

  findOne(id: string): Observable<T> {
    return from(this.databaseProvider.findOne(id));
  }
}
