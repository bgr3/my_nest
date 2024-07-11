import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsORMRepository } from '../../../blogs/infrastructure/orm/blogs-orm-repository';
import { UserBlogBanDTO } from '../../api/dto/input/users-input-dto';
import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../infrastructure/users-repository';

export class UsersBloggerBanUnbanCommand {
  constructor(
    public userId: string,
    public dto: UserBlogBanDTO,
  ) {}
}

@CommandHandler(UsersBloggerBanUnbanCommand)
export class UsersBloggerBanUnbanUseCase
  implements ICommandHandler<UsersBloggerBanUnbanCommand>
{
  constructor(
    protected usersRepository: UsersORMRepository,
    protected blogsRepository: BlogsORMRepository,
  ) {}

  async execute(command: UsersBloggerBanUnbanCommand): Promise<string | null> {
    const user = await this.usersRepository.findUserDbByID(command.userId);
    const blog = await this.blogsRepository.getBlogById(command.dto.blogId);

    if (!user) return null;
    if (!blog) return null;

    user.blogBanUnban(command.dto, blog);

    const result = await this.usersRepository.save(user);

    return result;
  }
}
