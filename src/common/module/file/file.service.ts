import { Inject, Injectable } from '@nestjs/common';
import { IFileService, IStorageService } from './file.interface';

@Injectable()
export class FileService implements IFileService {
  constructor(
    @Inject(IStorageService)
    private storageService: Record<string, IStorageService>,
  ) {}

  upload(file: string, storageKey: string): string {
    const strategy = this.storageService[storageKey];

    if (!strategy) {
      throw new Error(`Storage strategy not found: ${storageKey}`);
    }

    return strategy.uploadFile(file);
  }
}
