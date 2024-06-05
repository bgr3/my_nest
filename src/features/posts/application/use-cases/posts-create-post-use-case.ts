import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsORMQueryRepository } from '../../../blogs/infrastructure/orm/blogs-orm-query-repository';
import { PostPostType } from '../../api/dto/input/post-input-dto';
import { PostORM } from '../../domain/posts-orm-entity';
import { PostsORMRepository } from '../../infrastructure/orm/posts-orm-repository';

export class PostsCreatePostCommand {
  constructor(public dto: PostPostType) {}
}

@CommandHandler(PostsCreatePostCommand)
export class PostsCreatePostUseCase
  implements ICommandHandler<PostsCreatePostCommand>
{
  constructor(
    private readonly postsRepository: PostsORMRepository,
    private readonly blogsQueryRepository: BlogsORMQueryRepository,
  ) {}

  async execute(command: PostsCreatePostCommand): Promise<string | null> {
    const blog = await this.blogsQueryRepository.findBlogByID(
      command.dto.blogId.trim(),
    );

    if (!blog) return null;
    const newPost = PostORM.createPost(
      command.dto.title,
      command.dto.shortDescription,
      command.dto.content,
      command.dto.blogId,
    );

    const result = await this.postsRepository.save(newPost);

    return result;
  }
}
