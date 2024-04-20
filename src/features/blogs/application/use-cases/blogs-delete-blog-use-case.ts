import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsORMRepository } from '../../infrastructure/orm/blogs-orm-repository';
// import { BlogsSQLRepository } from '../../infrastructure/sql/blogs-sql-repository';
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
    // protected blogsRepository: BlogsSQLRepository,
    private readonly blogsRepository: BlogsORMRepository,
  ) {}

  async execute(command: BlogsDeleteBlogCommand): Promise<boolean> {
    return this.blogsRepository.deleteBlog(command.id);
  }
}
