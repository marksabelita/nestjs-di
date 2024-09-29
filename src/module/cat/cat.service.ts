import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import {
  ICat,
  ICatRepository,
  ICatResponse,
  ICatService,
} from './cat.interface';
import { CreateDto, UpdateDto } from './dto/create.dto';
import { ILoggerService } from 'src/common/module/logger/logger.interface';
import { IDatabaseTransaction } from 'src/common/database/database.inteface';

@Injectable()
export class CatService implements ICatService {
  constructor(
    @Inject(IDatabaseTransaction)
    private transaction: IDatabaseTransaction,
    @Inject(ICatRepository)
    private readonly catRepository: ICatRepository,
    @Inject(ILoggerService)
    private readonly loggerService: ILoggerService,
  ) {}

  create(dto: CreateDto): Observable<ICatResponse> {
    this.loggerService.log(dto, 'CatService.create');

    return this.transaction.startTransaction().pipe(
      switchMap((transaction) => {
        return this.catRepository.create(dto, transaction).pipe(
          switchMap((cat) => {
            this.loggerService.log({ ...cat }, 'transaction insert result');

            return this.catRepository.create(
              { name: 'this is batman' },
              transaction,
            );
          }),
          switchMap((cat) =>
            this.transaction
              .commitTransaction(transaction)
              .pipe(map(() => cat)),
          ),
          catchError((error) => {
            return this.transaction
              .rollbackTransaction(transaction)
              .pipe(switchMap(() => throwError(() => error)));
          }),
        );
      }),
    );
  }

  update(id: string, data: UpdateDto): Observable<ICatResponse> {
    return from(this.catRepository.update(id, data));
  }

  findAll(filters: Record<string, unknown>): Observable<ICatResponse[]> {
    this.loggerService.log(filters, 'CatService.findAll');

    return from(this.catRepository.findAll(filters));
  }

  delete(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  findOne(): Observable<ICat> {
    throw new Error('Method not implemented.');
  }
}
