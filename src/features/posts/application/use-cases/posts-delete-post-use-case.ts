import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsSQLRepository } from '../../infrastructure/posts-sql-repository';
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
    private readonly postsRepository: PostsSQLRepository,
  ) {}

  async execute(command: PostsDeletePostCommand): Promise<boolean> {
    return this.postsRepository.deletePost(command.id);
  }
}
