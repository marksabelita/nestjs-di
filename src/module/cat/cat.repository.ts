import { Inject, Injectable } from '@nestjs/common';
import { ICat, ICatSequalizeProvider } from './cat.interface';
import { IDatabaseProvider } from 'src/common/database/database.inteface';
import { CreateDto, UpdateDto } from './dto/create.dto';
import { BaseRepository } from 'src/common/database/base.repository';
import { from, Observable } from 'rxjs';

@Injectable()
export class CatRepository extends BaseRepository<ICat, CreateDto, UpdateDto> {
  constructor(
    @Inject(ICatSequalizeProvider)
    protected readonly databaseProvider: IDatabaseProvider<
      ICat,
      CreateDto,
      UpdateDto
    >,
  ) {
    super(databaseProvider);
  }

  // sample override
  create(dto: CreateDto): Observable<ICat> {
    return from(this.databaseProvider.create(dto));
  }
}
