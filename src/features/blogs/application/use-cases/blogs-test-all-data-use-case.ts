import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../infrastructure/blogs-repository";

export class BlogsTestAllDataCommand {
    constructor(){};
};

@CommandHandler(BlogsTestAllDataCommand)
export class BlogsTestAllDatasUseCase implements ICommandHandler<BlogsTestAllDataCommand> {
    constructor (protected blogsRepository: BlogsRepository,){}

    async execute(command: BlogsTestAllDataCommand): Promise<void> {
        return this.blogsRepository.testAllData(); 
    };
};