import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { ICat } from './cat.interface';

@Table({
  tableName: 'Cats', // Explicitly specify the table name
})
export class CatModel extends Model<CatModel> implements ICat {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  name: string;
}

@Schema({ collection: 'cat' })
export class CatDocument extends Document implements ICat {
  @Prop({ default: () => new Types.ObjectId() })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  test?: string;
}

export const CatSchema = SchemaFactory.createForClass(CatDocument);
