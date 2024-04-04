import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsORMRepository } from '../../infrastructure/orm/posts-orm-repository';
// import { PostsSQLRepository } from '../../infrastructure/sql/posts-sql-repository';
// import { PostsRepository } from '../../infrastructure/posts-repository';

export class PostsDeletePostCommand {
  constructor(public id: string) {}
}

@CommandHandler(PostsDeletePostCommand)
export class PostsDeletePostUseCase
  implements ICommandHandler<PostsDeletePostCommand>
{
  constructor(
    // private readonly postsRepository: PostsRepository
    // private readonly postsRepository: PostsSQLRepository,
    private readonly postsRepository: PostsORMRepository,
  ) {}

  async execute(command: PostsDeletePostCommand): Promise<boolean> {
    return this.postsRepository.deletePost(command.id);
  }
}
