import { ILocation } from './location.interface';
import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table
export class LocationModel extends Model<LocationModel> implements ILocation {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  x: string;

  @Column
  y: string;
}
