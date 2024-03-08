import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blogs-entity';
import { validateOrReject } from 'class-validator';
import { BlogPostType } from '../../api/dto/input/blogs-input-dto';
import { BlogsSQLRepository } from '../../infrastructure/blogs-sql-repository';
import { BlogSQL } from '../../domain/blogs-sql-entity';
// import { BlogsRepository } from '../../infrastructure/blogs-repository';

export class BlogsCreateBlogCommand {
  constructor(public dto: BlogPostType) {}
}

const validateOrRejectModel = async (model: any, ctor: { new (): any }) => {
  if (model instanceof ctor === false) {
    throw new Error('incorrect input data');
  }

  try {
    await validateOrReject(model);
  } catch (err) {
    throw new Error(err); //for what?
  }
};

@CommandHandler(BlogsCreateBlogCommand)
export class BlogsCreateBlogUseCase
  implements ICommandHandler<BlogsCreateBlogCommand>
{
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    //protected blogsRepository: BlogsRepository,
    protected blogsRepository: BlogsSQLRepository,
  ) {}

  async execute(command: BlogsCreateBlogCommand): Promise<string | null> {
    validateOrRejectModel(command.dto, BlogPostType);
    const newBlog = BlogSQL /*Blog*/.createBlog(command.dto);
    //const newBlogModel = new this.BlogModel(newBlog);

    const result = await this.blogsRepository.save(newBlog /*newBlogModel*/);

    return result /*newBlogModel._id.toString()*/;
  }
}
