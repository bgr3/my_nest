import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogPutType } from '../../api/dto/input/blogs-input-dto';
import { BlogsORMRepository } from '../../infrastructure/orm/blogs-orm-repository';
// import { BlogsSQLRepository } from '../../infrastructure/sql/blogs-sql-repository';
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
    // protected blogsRepository: BlogsSQLRepository,
    private readonly blogsRepository: BlogsORMRepository,
  ) {}

  async execute(command: BlogsUpdateBlogCommand): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogById(command.id);

    if (blog) {
      blog.updateBlog(command.dto);
      await this.blogsRepository.save(blog);
      return true;
    }

    return false;
  }
}
