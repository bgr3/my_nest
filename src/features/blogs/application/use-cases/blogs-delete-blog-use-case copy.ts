import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs-repository';

export class BlogsDeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(BlogsDeleteBlogCommand)
export class BlogsDeleteBlogUseCase
implements ICommandHandler<BlogsDeleteBlogCommand>
{
  constructor(protected blogsRepository: BlogsRepository) {}

  async execute(command: BlogsDeleteBlogCommand): Promise<boolean> {
    return this.blogsRepository.deleteBlog(command.id);
  }
}
