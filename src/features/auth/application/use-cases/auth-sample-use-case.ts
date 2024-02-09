import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthRepository } from "../../infrastructure/auth-repository";

export class AuthCommand {
    constructor(){};
};

@CommandHandler(AuthCommand)
export class AuthUseCase implements ICommandHandler<AuthCommand> {
    constructor (protected authRepository: AuthRepository,){}

    async execute(command: AuthCommand): Promise<void> {
        return ;      
    };
};