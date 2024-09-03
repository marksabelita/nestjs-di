import { Inject, Injectable } from '@nestjs/common';
import { from, Observable, tap } from 'rxjs';
import {
  ICat,
  ICatRepository,
  ICatResponse,
  ICatService,
} from './cat.interface';
import { CreateDto, UpdateDto } from './dto/create.dto';
import { IFileService } from 'src/common/module/file/file.interface';

@Injectable()
export class CatService implements ICatService {
  constructor(
    @Inject(ICatRepository)
    private readonly catRepository: ICatRepository,
    @Inject(IFileService)
    private readonly fileUploadService: IFileService,
  ) {}

  create(dto: CreateDto): Observable<ICatResponse> {
    return from(
      this.catRepository.create({
        name: dto.name,
      }),
    );
  }

  update(id: string, data: UpdateDto): Observable<ICatResponse> {
    return from(this.catRepository.update(id, data));
  }

  findAll(filters: Record<string, unknown>): Observable<ICatResponse[]> {
    return from(this.catRepository.findAll(filters)).pipe(
      tap(() => this.fileUploadService.upload('file', 'local')),
    );
  }

  delete(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  findOne(): Observable<ICat> {
    throw new Error('Method not implemented.');
  }
}
