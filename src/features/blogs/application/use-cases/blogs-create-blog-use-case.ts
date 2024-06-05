import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersORMRepository } from '../../../users/infrastructure/orm/users-orm-repository';
import { BlogPostType } from '../../api/dto/input/blogs-input-dto';
import { BlogORM } from '../../domain/blogs-orm-entity';
import { BlogsORMRepository } from '../../infrastructure/orm/blogs-orm-repository';
// import { BlogsSQLRepository } from '../../infrastructure/sql/blogs-sql-repository';
// import { Blog, BlogModelType } from '../../domain/blogs-entity';
// import { InjectModel } from '@nestjs/mongoose';
// import { BlogSQL } from '../../domain/blogs-sql-entity';
// import { BlogsRepository } from '../../infrastructure/blogs-repository';

export class BlogsCreateBlogCommand {
  constructor(
    public dto: BlogPostType,
    public userId: string,
  ) {}
}

// const validateOrRejectModel = async (model: any, ctor: { new (): any }) => {
//   if (model instanceof ctor === false) {
//     throw new Error('incorrect input data');
//   }

//   try {
//     await validateOrReject(model);
//   } catch (err) {
//     throw new Error(err); //for what?
//   }
// };

@CommandHandler(BlogsCreateBlogCommand)
export class BlogsCreateBlogUseCase
  implements ICommandHandler<BlogsCreateBlogCommand>
{
  constructor(
    //@InjectModel(Blog.name) private BlogModel: BlogModelType,
    //protected blogsRepository: BlogsRepository,
    // protected blogsRepository: BlogsSQLRepository,
    private readonly blogsRepository: BlogsORMRepository,
    private readonly usersRepository: UsersORMRepository,
  ) {}

  async execute(command: BlogsCreateBlogCommand): Promise<string | null> {
    // validateOrRejectModel(command.dto, BlogPostType);
    const user = await this.usersRepository.findUserDbByID(command.userId);

    if (!user) return null;

    const newBlog = BlogORM /*BlogSQL*/ /*Blog*/.createBlog(command.dto, user);
    //const newBlogModel = new this.BlogModel(newBlog);

    const result = await this.blogsRepository.save(newBlog /*newBlogModel*/);

    return result /*newBlogModel._id.toString()*/;
  }
}
