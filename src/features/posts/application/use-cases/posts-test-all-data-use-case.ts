import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsSQLRepository } from '../../infrastructure/posts-sql-repository';
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
    private readonly postsRepository: PostsSQLRepository,
  ) {}

  async execute(): Promise<void> {
    return await this.postsRepository.testAllData();
  }
}
