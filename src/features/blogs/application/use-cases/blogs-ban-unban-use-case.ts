import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogBanDTO } from '../../api/dto/input/blogs-input-dto';
import { BlogsORMRepository } from '../../infrastructure/orm/blogs-orm-repository';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../infrastructure/users-repository';

export class BlogsBanUnbanCommand {
  constructor(
    public blogId: string,
    public dto: BlogBanDTO,
  ) {}
}

@CommandHandler(BlogsBanUnbanCommand)
export class BlogsBanUnbanUseCase
  implements ICommandHandler<BlogsBanUnbanCommand>
{
  constructor(protected blogsRepository: BlogsORMRepository) {}

  async execute(command: BlogsBanUnbanCommand): Promise<string | null> {
    const blog = await this.blogsRepository.getBlogById(command.blogId);

    if (!blog) return null;

    blog.banUnban(command.dto.isBanned);

    const result = await this.blogsRepository.save(blog);

    return result;
  }
}
