import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatCoreModule } from './cat.core.module';
import { LoggerModule } from 'src/common/module/logger/logger.module';

@Module({
  imports: [CatCoreModule],
  controllers: [CatController],
})
export class CatModule {}
