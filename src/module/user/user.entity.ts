import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { IUser } from './user.interface';

@Table({
  tableName: 'User',
})
export class UserModel extends Model<UserModel> implements IUser {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  name: string;
}
