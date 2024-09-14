import { Injectable } from '@nestjs/common';
import { IStorageService } from './file.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageService implements IStorageService {
  constructor(private readonly configService: ConfigService) {}

  uploadFile(file: string): string {
    console.log('upload file to s3');
    return file;
  }
}
