export interface FileModuleOptions {
  defaultStorage: string;
  storage: Record<string, IStorageService>;
}

export interface IStorageService {
  uploadFile(file: string): string;
}

export interface IFileService {
  upload(file: string, storage: 'local' | 's3'): string;
}

export interface IFileConfig {}

export enum EStorageType {
  S3 = 's3',
}

export interface IStorageConfig {
  type: 'local' | 's3';
  config: any;
}

export const IStorageService = Symbol('IStorageService');
export const IFileService = Symbol('IFileUploadService');
