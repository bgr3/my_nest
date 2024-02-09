import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthRepository } from "../../infrastructure/auth-repository";

export class AuthDeleteAuthSessionByTokenCommand {
    constructor(public deviceId: string){};
};

@CommandHandler(AuthDeleteAuthSessionByTokenCommand)
export class AuthDeleteAuthSessionByTokenUseCase implements ICommandHandler<AuthDeleteAuthSessionByTokenCommand> {
    constructor (protected authRepository: AuthRepository,){}

    async execute(command: AuthDeleteAuthSessionByTokenCommand): Promise<boolean> {
        const result = await this.authRepository.deleteAuthSessionByDeviceId(command.deviceId)
    
        if (!result) return false
    
        return true  
    };
};