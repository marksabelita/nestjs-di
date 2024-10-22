import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  HTTP_MODULE_OPTIONS,
  IHttpModuleOptions,
  IHttpService,
} from './http.interface';
import { HttpService } from './http.service';
import { EnvironmentModule } from '../environment/environment.module';
import {
  EEnvironmentVariables,
  IEnvironmentService,
} from '../environment/environment.interface';

@Module({})
export class HttpModule {
  static forRootAsync(options: IHttpModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: HTTP_MODULE_OPTIONS,
      useFactory: (environmentService: IEnvironmentService) => ({
        baseURL: environmentService.get(
          options.baseURL as EEnvironmentVariables,
        ),
        timeout: options.timeout
          ? environmentService.getNumber(
              options.timeout as unknown as EEnvironmentVariables,
            )
          : 5000,
      }),
      inject: [IEnvironmentService],
    };

    return {
      module: HttpModule,
      imports: [EnvironmentModule],
      providers: [
        optionsProvider,
        {
          provide: IHttpService,
          useClass: HttpService,
        },
      ],
      exports: [IHttpService],
      global: true,
    };
  }
}
