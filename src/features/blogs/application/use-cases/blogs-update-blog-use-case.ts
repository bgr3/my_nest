import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogPutType } from '../../api/dto/input/blogs-input-dto';
import { BlogsSQLRepository } from '../../infrastructure/blogs-sql-repository';
//import { BlogsRepository } from '../../infrastructure/blogs-repository';

export class BlogsUpdateBlogCommand {
  constructor(
    public id: string,
    public dto: BlogPutType,
  ) {}
}

@CommandHandler(BlogsUpdateBlogCommand)
export class BlogsUpdateBlogUseCase
  implements ICommandHandler<BlogsUpdateBlogCommand>
{
  constructor(
    //protected blogsRepository: BlogsRepository
    protected blogsRepository: BlogsSQLRepository,
  ) {}

  async execute(command: BlogsUpdateBlogCommand): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogById(command.id);

    if (blog) {
      blog.updateBlog(command.dto);
      this.blogsRepository.save(blog);
      return true;
    }

    return false;
  }
}
