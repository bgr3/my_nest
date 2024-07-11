import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FilesStorageAdapter } from '../../../../base/adapters/files-storage-adapter';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../infrastructure/users-repository';

export class BlogsUploadBackgroundWallpaperCommand {
  constructor(
    public userId: string,
    public originalName: string,
    public file: Buffer,
  ) {}
}

@CommandHandler(BlogsUploadBackgroundWallpaperCommand)
export class BlogsUploadBackgroundWallpaperUseCase
  implements ICommandHandler<BlogsUploadBackgroundWallpaperCommand>
{
  constructor(protected filesStorageAdapter: FilesStorageAdapter) {}

  async execute(command: BlogsUploadBackgroundWallpaperCommand): Promise<void> {
    await this.filesStorageAdapter.saveFileAsync(
      command.userId,
      command.originalName,
      command.file,
    );
  }
}

export type SaveFileResultType = {
  url: string;
  id: string;
};
