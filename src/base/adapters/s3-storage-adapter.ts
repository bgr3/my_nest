import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3StorageAdapter {
  s3Client: S3Client;
  constructor() {
    const accessKeyID = process.env.YANDEX_KEY_ID;
    const secretAccessKey = process.env.YANDEX_SECRET_KEY;

    if (!accessKeyID || !secretAccessKey)
      throw new Error('have no yandex secret credentials');
    const REGION = 'us-east-1';
    this.s3Client = new S3Client({
      region: REGION,
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: accessKeyID,
        secretAccessKey: secretAccessKey,
      },
    });
  }
  // async saveFileAsync(
  //   userId: string,
  //   originalName: string,
  //   file: Buffer,
  // ): Promise<SaveFileResultType> {
  //   return {
  //     url: `/base/views/wallpapers/${userId}`,
  //     id: relativePath,
  //   };
  // }

  // async deleteFileAsync(fileId: string): Promise<void> {}
}
