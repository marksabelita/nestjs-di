import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { enumToArray } from 'src/common/helper/string.helper';

export enum EHttpLoggerType {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
}

@Table
export class HttpLogger extends Model<HttpLogger> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  method: string;

  @Column
  url: string;

  @Column
  statusCode: number;

  @Column
  contentLength: string;

  @Column
  userAgent: string;

  @Column
  ip: string;

  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @Column
  transactionId: string;

  @Column({
    type: DataType.ENUM(...enumToArray(EHttpLoggerType)),
  })
  request_type: string;
}
