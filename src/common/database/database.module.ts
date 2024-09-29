import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CatModel } from 'src/module/cat/cat.entity';
// import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        dialectOptions: {
          ssl: false,
        },
        host: 'localhost',
        port: 5432,
        username: 'citizix_user',
        password: 'S3cret',
        database: 'citizix_db',
        models: [CatModel],
      }),
      inject: [],
    }),
    // MongooseModule.forRootAsync({
    //   useFactory: async () => ({
    //     uri: '',
    //     dbName: 'project',
    //   }),
    //   inject: [],
    // }),
  ],
  exports: [],
})
export class DatabaseModule {}
