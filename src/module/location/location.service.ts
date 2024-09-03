import { Inject, Injectable } from '@nestjs/common';
import {
  ILocation,
  ILocationResponse,
  ILocationSequalizeProvider,
  ILocationService,
} from './location.interface';
import { from, map, Observable } from 'rxjs';
import { IDatabaseProvider } from 'src/common/database/database.inteface';
import { LocationCreateDto, LocationUpdateDto } from './location.dto';

@Injectable()
export class LocationService implements ILocationService {
  constructor(
    @Inject(ILocationSequalizeProvider)
    private readonly databaseProvider: IDatabaseProvider<
      ILocation,
      LocationCreateDto,
      LocationUpdateDto
    >,
  ) {}

  create(dto: LocationCreateDto): Observable<ILocationResponse> {
    return from(
      this.databaseProvider.create({
        x: dto.x,
        y: dto.y,
      }),
    ).pipe(
      map((cat) => ({
        id: cat.id,
        x: cat.x,
        y: cat.y,
      })),
    );
  }

  update(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  findAll(): Observable<ILocationResponse[]> {
    return from(this.databaseProvider.findAll()).pipe(
      map((d) => d.map((d) => ({ id: d.id, x: d.x, y: d.y }))),
    );
  }

  delete(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  findOne(): Observable<any> {
    return from([
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ]);
  }
}
