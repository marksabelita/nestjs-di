import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CatModel } from 'src/module/cat/cat.entity';
import { EnvironmentModule } from '../module/environment/environment.module';
import { IEnvironmentService } from '../module/environment/environment.interface';
// import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [EnvironmentModule],
      useFactory: (environmentService: IEnvironmentService) => ({
        ...environmentService.getPostgresConfig(),
        models: [CatModel],
      }),
      inject: [IEnvironmentService],
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
