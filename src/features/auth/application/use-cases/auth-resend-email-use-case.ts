import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../../users/infrastructure/users-repository";
import { EmailManager } from "../../../email-manager/application/email-manager";
import { v4 as uuidv4 } from 'uuid';

export class AuthResendEmailCommand {
    constructor(public email: string){};
};

@CommandHandler(AuthResendEmailCommand)
export class AuthResendEmailUseCase implements ICommandHandler<AuthResendEmailCommand> {
    constructor (
        protected usersRepository: UsersRepository,
        protected emailManager: EmailManager,
    ){}

    async execute(command: AuthResendEmailCommand): Promise<boolean> {
        const user = await this.usersRepository.findUserByLoginOrEmail(command.email);
  
        if (!user) return false;
  
        const code = uuidv4();
  
        await user.resendConfirmationCode(code);
        await this.usersRepository.save(user);
        await this.emailManager.sendRegistrationEmail(code, user.email);
  
        return true
    };
};