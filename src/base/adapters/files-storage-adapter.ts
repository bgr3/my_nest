import { unlinkSync } from 'node:fs';
import path from 'node:path';

import { Injectable } from '@nestjs/common';

import { SaveFileResultType } from '../../features/blogs/application/use-cases/blogs-upload-background-wallpaper-use-case';
import { ensureDirSync, saveFileAsync } from '../utils/fs-utils';

@Injectable()
export class FilesStorageAdapter {
  async saveFileAsync(
    userId: string,
    originalName: string,
    file: Buffer,
  ): Promise<SaveFileResultType> {
    const dirPath = path.join(
      './',
      'base',
      'views',
      'wallpapers',
      userId,
      // wallpaper.originalname,
    );

    const relativePath = path.join(dirPath, originalName);

    await ensureDirSync(dirPath);

    await saveFileAsync(relativePath, file);

    return {
      url: `/base/views/wallpapers/${userId}`,
      id: relativePath,
    };
  }

  async deleteFileAsync(fileId: string): Promise<void> {
    await unlinkSync(fileId);
  }
}
