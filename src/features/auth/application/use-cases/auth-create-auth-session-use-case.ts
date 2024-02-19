import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Auth, AuthModelType } from "../../domain/auth-entity";
import { Tokens } from "../../api/dto/output/auth-output-dto";
import { AuthRepository } from "../../infrastructure/auth-repository";
import { AuthService } from "../auth-service";
import { v4 as uuidv4 } from 'uuid';

export class AuthCreateAuthSessionCommand {
    constructor(
        public userId: string,
        public deviceIP: string,
        public deviceName: string,
    ){};
};

@CommandHandler(AuthCreateAuthSessionCommand)
export class AuthCreateAuthSessionUseCase implements ICommandHandler<AuthCreateAuthSessionCommand> {
    constructor (
        @InjectModel(Auth.name) private AuthModel: AuthModelType,
        protected authRepository: AuthRepository,
        protected authService: AuthService,
    ){}

    async execute(command: AuthCreateAuthSessionCommand): Promise<Tokens> {
        const deviceId = uuidv4();
        
        const tokens = await this.authService.generateTokens(command.userId, deviceId);
    
        const authSession = Auth.createAuth(
            command.userId,
            command.deviceIP,
            deviceId,
            command.deviceName,
            tokens.accessToken,
            tokens.refreshToken,
            tokens.issuedAt,
            tokens.expireAt,
        );
    
        const newAuthModel = new this.AuthModel(authSession);
    
        await this.authRepository.save(newAuthModel);
    
        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
    };
};