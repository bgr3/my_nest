import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts-entity';
import { PostPostType } from '../../api/dto/input/post-input-dto';
import { BlogsSQLQueryRepository } from '../../../blogs/infrastructure/blogs-sql-query-repository';
import { PostsSQLRepository } from '../../infrastructure/posts-sql-repository';
import { PostSQL } from '../../domain/posts-sql-entity';
// import { PostsRepository } from '../../infrastructure/posts-repository';
// import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs-query-repository';

export class PostsCreatePostCommand {
  constructor(public dto: PostPostType) {}
}

@CommandHandler(PostsCreatePostCommand)
export class PostsCreatePostUseCase
  implements ICommandHandler<PostsCreatePostCommand>
{
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    // private readonly postsRepository: PostsRepository,
    private readonly postsRepository: PostsSQLRepository,

    // private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsQueryRepository: BlogsSQLQueryRepository,
  ) {}

  async execute(command: PostsCreatePostCommand): Promise<string | null> {
    const blogName = (
      await this.blogsQueryRepository.findBlogByID(command.dto.blogId.trim())
    )?.name;

    if (blogName) {
      const newPost = PostSQL /*Post*/.createPost(
        command.dto.title,
        command.dto.shortDescription,
        command.dto.content,
        command.dto.blogId,
        blogName,
      );

      // const newPostModel = new this.PostModel(newPost);

      const result = await this.postsRepository.save(newPost /*newPostModel*/);

      return result /*newPostModel._id.toString()*/;
    }

    return null;
  }
}
