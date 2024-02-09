import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../infrastructure/blogs-repository";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogModelType } from "../../domain/blogs-entity";
import { validateOrReject } from 'class-validator';
import { BlogPostType } from "../../api/dto/input/blogs-input-dto";


export class BlogsCreateBlogCommand {
    constructor(public dto: BlogPostType){};
};

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
export class BlogsCreateBlogUseCase implements ICommandHandler<BlogsCreateBlogCommand> {
    constructor (
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
        protected blogsRepository: BlogsRepository,
        ){}

    async execute(command: BlogsCreateBlogCommand): Promise<string | null> {
        validateOrRejectModel(command.dto, BlogPostType);
        const newBlog = Blog.createBlog(command.dto);
        const newBlogModel = new this.BlogModel(newBlog);
    
        await this.blogsRepository.save(newBlogModel);
    
        return newBlogModel._id.toString();      
    };
};