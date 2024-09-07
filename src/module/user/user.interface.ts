import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { IDatabaseProvider } from 'src/common/database/database.inteface';

export interface IUser {
  id: string;
  name: string;
}

export interface IUserRepository
  extends IDatabaseProvider<IUser, CreateUserDto, UpdateUserDto> {
  create(dto: CreateUserDto): Observable<IUser>;
  update(id: string, dto: UpdateUserDto): Observable<IUser>;
  findAll(filters: Record<string, unknown>): Observable<IUser[]>;
  delete(id: string): Observable<boolean>;
  findOne(id: string): Observable<IUser>;
}

export const IUserSequalizeProvider = Symbol('IUserSequalizeProvider');
export const IUserRepository = Symbol('IUserRepository');
