import { Injectable } from '@nestjs/common';
import { IStorageService } from './file.interface';

@Injectable()
export class S3StorageService implements IStorageService {
  constructor(
    private readonly accessKeyId: string,
    private readonly secretAccessKey: string,
    private readonly region: string,
    private readonly bucketName: string,
  ) {}

  uploadFile(file: string): string {
    console.log('upload file to s3');
    return file;
  }
}
