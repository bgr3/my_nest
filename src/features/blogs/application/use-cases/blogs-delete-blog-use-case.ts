import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSQLRepository } from '../../infrastructure/blogs-sql-repository';
// import { BlogsRepository } from '../../infrastructure/blogs-repository';

export class BlogsDeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(BlogsDeleteBlogCommand)
export class BlogsDeleteBlogUseCase
  implements ICommandHandler<BlogsDeleteBlogCommand>
{
  constructor(
    //protected blogsRepository: BlogsRepository
    protected blogsRepository: BlogsSQLRepository,
  ) {}

  async execute(command: BlogsDeleteBlogCommand): Promise<boolean> {
    return this.blogsRepository.deleteBlog(command.id);
  }
}
