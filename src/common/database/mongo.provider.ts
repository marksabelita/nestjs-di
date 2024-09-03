import { Injectable } from '@nestjs/common';
import { from, map, Observable } from 'rxjs';
import { IDatabaseProvider } from './database.inteface';
import { Model } from 'mongoose';

@Injectable()
export class MongoDBProvider<T, CreateDTO, UpdateDTO = Partial<CreateDTO>>
  implements IDatabaseProvider<T, CreateDTO, UpdateDTO>
{
  constructor(private readonly model: Model<T>) {}

  create(dto: CreateDTO): Observable<T> {
    return from(this.model.create(dto));
  }

  update(id: string, dto: UpdateDTO): Observable<T> {
    return from(
      this.model.findByIdAndUpdate(id, dto, { new: true }).lean().exec(),
    ).pipe(map((result) => result as T));
  }

  findAll(): Observable<T[]> {
    return from(this.model.find().lean().exec()).pipe(
      map((documents) => documents.map((doc) => doc as T)),
    );
  }

  delete(id: string): Observable<boolean> {
    return from(this.model.findByIdAndDelete(id)).pipe(
      map((result) => !!result),
    );
  }

  findOne(id: string): Observable<T | null> {
    return from(this.model.findById(id).lean().exec()).pipe(
      map((result) => result as T),
    );
  }

  raw<U>(): Observable<U> {
    throw new Error('not implementated');
  }
}
