import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../../users/infrastructure/users-repository";
import { EmailManager } from "../../../email-manager/application/email-manager";

export class AuthChangePasswordEmailCommand {
    constructor(public id: string){};
};

@CommandHandler(AuthChangePasswordEmailCommand)
export class AuthChangePasswordEmailUseCase implements ICommandHandler<AuthChangePasswordEmailCommand> {
    constructor (
        protected usersRepository: UsersRepository,
        protected emailManager: EmailManager,
    ){}

    async execute(command: AuthChangePasswordEmailCommand): Promise<boolean> {
        let user = await this.usersRepository.findUserDbByID(command.id);
  
        if (!user) return false
  
        console.log(user.emailConfirmation.confirmationCode);
  
        await this.emailManager.sendRecoveryPasswordEmail(user.emailConfirmation.confirmationCode, user.email)
  
        return true
    };
};