import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EmailManager } from "../../../email-manager/application/email-manager";
import { UsersRepository } from "../../../users/infrastructure/users-repository";

export class AuthRegisterUserSendEmailCommand {
    constructor(public id: string){};
};

@CommandHandler(AuthRegisterUserSendEmailCommand)
export class AuthRegisterUserSendEmailUseCase implements ICommandHandler<AuthRegisterUserSendEmailCommand> {
    constructor (
        protected usersRepository: UsersRepository,
        protected emailManager: EmailManager,
    ){}

    async execute(command: AuthRegisterUserSendEmailCommand): Promise<boolean> {
        let user = await this.usersRepository.findUserDbByID(command.id)
  
        if (!user) return false
  
        await this.emailManager.sendRegistrationEmail(user.emailConfirmation.confirmationCode, user.email)
  
        return true     
    };
};