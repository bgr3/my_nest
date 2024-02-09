import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MeType } from "../../api/dto/output/auth-output-dto";
import { UsersRepository } from "../../../users/infrastructure/users-repository";

export class AuthGetMeByIdCommand {
    constructor(public userId: string){};
};

@CommandHandler(AuthGetMeByIdCommand)
export class AuthGetMeByIdUseCase implements ICommandHandler<AuthGetMeByIdCommand> {
    constructor (protected usersRepository: UsersRepository,){}

    async execute(command: AuthGetMeByIdCommand): Promise<MeType | null> {
        //const userId = await this.jwtService.verifyAsync(accessToken);

        const user = await this.usersRepository.findUserDbByID(command.userId);

        if (!user) return null;
    
        const me = user.getMe(command.userId);
    
        return me;  
    };
};