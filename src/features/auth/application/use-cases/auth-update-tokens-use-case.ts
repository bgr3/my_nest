import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthRepository } from "../../infrastructure/auth-repository";
import { Tokens } from "../../api/dto/output/auth-output-dto";
import { AuthService } from "../auth-service";
import { UsersRepository } from "../../../users/infrastructure/users-repository";
import { v4 as uuidv4 } from 'uuid';

export class AuthUpdateTokensCommand {
    constructor(public deviceId: string){};
};

@CommandHandler(AuthUpdateTokensCommand)
export class AuthUpdateTokensUseCase implements ICommandHandler<AuthUpdateTokensCommand> {
    constructor (
        protected authRepository: AuthRepository,
        protected authService: AuthService,
        protected usersRepository: UsersRepository,
    ){}

    async execute(command: AuthUpdateTokensCommand): Promise<Tokens | null> {
        const session = await this.authRepository.findAuthSessionByDeviceId(command.deviceId)
    
        if (!session) return null;
    
        const user = await this.usersRepository.findUserDbByID(session.userId)
        
        if (!user) return null;

        const newDeviceId = uuidv4();
    
        const tokens = await this.authService.generateTokens(user._id.toString(), newDeviceId);
    
        await session.updateAuthSession(newDeviceId, tokens.accessToken, tokens.refreshToken, tokens.issuedAt, tokens.expireAt)
    
        await this.authRepository.save(session)
    
    
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }
    };
};