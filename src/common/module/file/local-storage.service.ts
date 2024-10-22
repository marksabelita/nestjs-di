import { Injectable } from '@nestjs/common';
import { IStorageService } from './file.interface';

@Injectable()
export class LocalStorageService implements IStorageService {
  constructor(private readonly filePath) {}

  uploadFile(file: string): string {
    return file;
  }
}
