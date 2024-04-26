import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsORMRepository } from '../../infrastructure/orm/posts-orm-repository';
// import { PostsSQLRepository } from '../../infrastructure/sql/posts-sql-repository';
// import { PostsRepository } from '../../infrastructure/posts-repository';

export class PostsTestAllDataCommand {
  constructor() {}
}

@CommandHandler(PostsTestAllDataCommand)
export class PostsTestAllDataUseCase
  implements ICommandHandler<PostsTestAllDataCommand>
{
  constructor(
    // private readonly postsRepository: PostsRepository
    // private readonly postsRepository: PostsSQLRepository,
    private readonly postsRepository: PostsORMRepository,
  ) {}

  async execute(): Promise<void> {
    const result = await this.postsRepository.testAllData();
    return result;
  }
}
