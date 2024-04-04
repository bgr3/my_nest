import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts-entity';
import { PostPostType } from '../../api/dto/input/post-input-dto';
// import { PostsSQLRepository } from '../../infrastructure/sql/posts-sql-repository';
import { PostSQL } from '../../domain/posts-sql-entity';
import { BlogsORMQueryRepository } from '../../../blogs/infrastructure/orm/blogs-orm-query-repository';
import { PostsORMRepository } from '../../infrastructure/orm/posts-orm-repository';
import { PostORM } from '../../domain/posts-orm-entity';
// import { BlogsSQLQueryRepository } from '../../../blogs/infrastructure/sql/blogs-sql-query-repository';
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
    // private readonly postsRepository: PostsSQLRepository,
    private readonly postsRepository: PostsORMRepository,
    // private readonly blogsQueryRepository: BlogsQueryRepository,
    // private readonly blogsQueryRepository: BlogsSQLQueryRepository,
    private readonly blogsQueryRepository: BlogsORMQueryRepository,
  ) {}

  async execute(command: PostsCreatePostCommand): Promise<string | null> {
    const blogName = (
      await this.blogsQueryRepository.findBlogByID(command.dto.blogId.trim())
    )?.name;

    if (blogName) {
      const newPost = PostORM /*PostSQL*/ /*Post*/.createPost(
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
