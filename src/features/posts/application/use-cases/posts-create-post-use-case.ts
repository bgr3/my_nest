import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../infrastructure/posts-repository";
import { BlogsQueryRepository } from "../../../blogs/infrastructure/blogs-query-repository";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostModelType } from "../../domain/posts-entity";
import { PostPostType } from "../../api/dto/input/post-input-dto";

export class PostsCreatePostCommand {
    constructor(public dto: PostPostType){};
};

@CommandHandler(PostsCreatePostCommand)
export class PostsCreatePostUseCase implements ICommandHandler<PostsCreatePostCommand> {
    constructor (
        @InjectModel(Post.name) private PostModel: PostModelType,
        private readonly postsRepository: PostsRepository,
        private readonly blogsQueryRepository: BlogsQueryRepository,
        ){}

    async execute(command: PostsCreatePostCommand): Promise<string | null> {
        const blogName = (
            await this.blogsQueryRepository.findBlogByID(command.dto.blogId.trim())
          )?.name;
      
          if (blogName) {
            const newPost = Post.createPost(
                command.dto.title,
                command.dto.shortDescription,
                command.dto.content,
                command.dto.blogId,
                blogName,
            );
      
            const newPostModel = new this.PostModel(newPost);
      
            await this.postsRepository.save(newPostModel);
      
            return newPostModel._id.toString();
          }
      
          return null;
    };
};