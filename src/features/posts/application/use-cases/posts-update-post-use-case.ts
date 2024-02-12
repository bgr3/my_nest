import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../infrastructure/posts-repository";
import { PostPutType } from "../../api/dto/input/post-input-dto";
import { BlogsQueryRepository } from "../../../blogs/infrastructure/blogs-query-repository";

export class PostsUpdatePostCommand {
    constructor(
        public id: string, 
        public dto: PostPutType){};
};

@CommandHandler(PostsUpdatePostCommand)
export class PostsUpdatePostUseCase implements ICommandHandler<PostsUpdatePostCommand> {
    constructor (
        private readonly postsRepository: PostsRepository,
        private readonly blogsQueryRepository: BlogsQueryRepository,
    ){}

    async execute(command: PostsUpdatePostCommand): Promise<boolean> {
        const blogName = (
            await this.blogsQueryRepository.findBlogByID(command.dto.blogId.trim())
          )?.name;
      
          const post = await this.postsRepository.getPostById(command.id);
      
          if (!post || !blogName) return false;
      
          post.updatePost(
            command.dto.title,
            command.dto.shortDescription,
            command.dto.content,
            command.dto.blogId,
            blogName,
          );
          this.postsRepository.save(post);
      
          return true;
    };
};