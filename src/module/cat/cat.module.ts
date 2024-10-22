import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatCoreModule } from './cat.core.module';

@Module({
  imports: [CatCoreModule],
  controllers: [CatController],
})
export class CatModule {}
