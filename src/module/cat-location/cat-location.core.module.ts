import { Module } from '@nestjs/common';
import { LocationCoreModule } from '../location/location.core.module';
import { ICatLocationService } from './cat-location.interface';
import { CatLocationService } from './cat-location.service';

@Module({
  imports: [CatCoreModule, LocationCoreModule],
  providers: [
    {
      provide: ICatLocationService,
      useClass: CatLocationService,
    },
  ],
  exports: [ICatLocationService],
})
export class CatCoreModule {}
