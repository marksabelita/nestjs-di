import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentService } from './environment.service';
import { IEnvironmentService } from './environment.interface';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
  ],
  providers: [
    {
      provide: IEnvironmentService,
      useClass: EnvironmentService,
    },
  ],
  exports: [IEnvironmentService],
})
export class EnvironmentModule {}
