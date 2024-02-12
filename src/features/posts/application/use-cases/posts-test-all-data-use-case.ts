import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../infrastructure/posts-repository";

export class PostsTestAllDataCommand {
    constructor(){};
};

@CommandHandler(PostsTestAllDataCommand)
export class PostsTestAllDataUseCase implements ICommandHandler<PostsTestAllDataCommand> {
    constructor (private readonly postsRepository: PostsRepository,){}

    async execute(command: PostsTestAllDataCommand): Promise<void> {
        return  await this.postsRepository.testAllData();      
    };
};