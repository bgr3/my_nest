import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostPutType } from '../../api/dto/input/post-input-dto';
import { BlogsORMQueryRepository } from '../../../blogs/infrastructure/orm/blogs-orm-query-repository';
import { PostsORMRepository } from '../../infrastructure/orm/posts-orm-repository';
// import { PostsSQLRepository } from '../../infrastructure/sql/posts-sql-repository';
// import { BlogsSQLQueryRepository } from '../../../blogs/infrastructure/sql/blogs-sql-query-repository';
// import { PostsRepository } from '../../infrastructure/posts-repository';
// import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs-query-repository';

export class PostsUpdatePostCommand {
  constructor(
    public id: string,
    public dto: PostPutType,
  ) {}
}

@CommandHandler(PostsUpdatePostCommand)
export class PostsUpdatePostUseCase
  implements ICommandHandler<PostsUpdatePostCommand>
{
  constructor(
    // private readonly postsRepository: PostsRepository,
    // private readonly postsRepository: PostsSQLRepository,
    private readonly postsRepository: PostsORMRepository,
    // private readonly blogsQueryRepository: BlogsQueryRepository,
    // private readonly blogsQueryRepository: BlogsSQLQueryRepository,
    private readonly blogsQueryRepository: BlogsORMQueryRepository,
  ) {}

  async execute(command: PostsUpdatePostCommand): Promise<boolean> {
    const blog = await this.blogsQueryRepository.findBlogByID(
      command.dto.blogId.trim(),
    );

    const post = await this.postsRepository.getPostById(command.id);

    if (!post || !blog) return false;

    post.updatePost(
      command.dto.title,
      command.dto.shortDescription,
      command.dto.content,
      command.dto.blogId,
      // blogName,
    );
    await this.postsRepository.save(post);

    return true;
  }
}
