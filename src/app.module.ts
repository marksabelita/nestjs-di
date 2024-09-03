import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './module/cat/cat.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpLogger } from './common/module/http-logger/http-logger.entity';
import { CatModel } from './module/cat/cat.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModel } from './module/location/location.entity';
import { HttpContextMiddleware } from './common/middleware/http-context.middleware';
import { LoggerModule } from './common/module/logger/logger.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectOptions: {
        ssl: false,
      },
      host: 'localhost',
      port: 5432,
      username: 'citizix_user',
      password: 'S3cret',
      database: 'citizix_db',
      models: [CatModel, HttpLogger, LocationModel],
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb://root:example@0.0.0.0:27017/',
        dbName: 'marktest',
      }),
      inject: [],
    }),
    CatModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpContextMiddleware).forRoutes('*');
  }
}
