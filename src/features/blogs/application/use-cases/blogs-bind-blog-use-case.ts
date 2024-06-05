import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersORMRepository } from '../../../users/infrastructure/orm/users-orm-repository';
import { BlogsORMRepository } from '../../infrastructure/orm/blogs-orm-repository';

export class BlogsBindBlogCommand {
  constructor(
    public blogId: string,
    public userId: string,
  ) {}
}

@CommandHandler(BlogsBindBlogCommand)
export class BlogsBindBlogUseCase
  implements ICommandHandler<BlogsBindBlogCommand>
{
  constructor(
    private readonly blogsRepository: BlogsORMRepository,
    private readonly usersRepository: UsersORMRepository,
  ) {}

  async execute(command: BlogsBindBlogCommand): Promise<boolean> {
    const user = await this.usersRepository.findUserDbByID(command.userId);
    const blog = await this.blogsRepository.getBlogById(command.blogId);

    if (!user || !blog) return false;

    blog.bindBloger(user);

    await this.blogsRepository.save(blog);

    return true;
  }
}
