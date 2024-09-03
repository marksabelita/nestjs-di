// import { DynamicModule, Module } from '@nestjs/common';
// import { FileModuleOptions, IFileService } from './file.interface';
// import { FileService } from './file.service';
//
// export interface FileUploadModuleAsyncOptions {
//   imports?: any[];
//   useFactory: (
//     ...args: any[]
//   ) => Promise<FileModuleOptions> | FileModuleOptions;
//   inject?: any[];
// }
//
// @Module({})
// export class FileModule {
//   static forRootAsync(options: FileUploadModuleAsyncOptions): DynamicModule {
//     const optionsProvider = {
//       provide: 'FILE_UPLOAD_MODULE_OPTIONS',
//       useFactory: options.useFactory,
//       inject: options.inject || [],
//     };
//
//     return {
//       module: FileModule,
//       imports: options.imports || [],
//       providers: [
//         optionsProvider,
//         {
//           provide: IFileService,
//           useClass: FileService,
//         },
//         {
//           provide: 'STORAGE_STRATEGIES',
//           useFactory: (moduleOptions: FileModuleOptions) =>
//             moduleOptions.storage,
//           inject: ['FILE_UPLOAD_MODULE_OPTIONS'],
//         },
//         {
//           provide: 'DEFAULT_STRATEGY',
//           useFactory: (moduleOptions: FileModuleOptions) =>
//             moduleOptions.defaultStorage,
//           inject: ['FILE_UPLOAD_MODULE_OPTIONS'],
//         },
//         FileService,
//       ],
//       exports: [FileService, 'STORAGE_STRATEGIES', 'DEFAULT_STRATEGY'],
//     };
//   }
// }
