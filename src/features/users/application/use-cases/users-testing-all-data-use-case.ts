import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users-repository";

export class UsersTestAllDataCommand {
};

@CommandHandler(UsersTestAllDataCommand)
export class UsersTestAllDataUseCase implements ICommandHandler<UsersTestAllDataCommand> {
    constructor (protected usersRepository: UsersRepository,){}

    async execute(command: UsersTestAllDataCommand): Promise<void> {
        return this.usersRepository.testAllData();        
    };
}