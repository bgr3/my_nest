import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../infrastructure/posts-repository";

export class PostsDeletePostCommand {
    constructor(public id: string){};
};

@CommandHandler(PostsDeletePostCommand)
export class PostsDeletePostUseCase implements ICommandHandler<PostsDeletePostCommand> {
    constructor (protected postsRepository: PostsRepository,){}

    async execute(command: PostsDeletePostCommand): Promise<boolean> {
        return this.postsRepository.deletePost(command.id);      
    };
};