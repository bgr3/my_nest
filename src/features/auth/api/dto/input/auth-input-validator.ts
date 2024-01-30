import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../../users/infrastructure/users-repository';

@ValidatorConstraint({ name: 'customText', async: true })
@Injectable()
export class AuthEmailConfirmValidation implements ValidatorConstraintInterface {
    constructor(
        protected usersRepository: UsersRepository,
      ) {}

    errorMessage: string;

    async validate(code: string, args: ValidationArguments) {        
        const user = await this.usersRepository.findUserByConfirmationCode(code)

        if (!user)  {
            this.errorMessage = 'User doesn`t exist';
            return false
        }
        if (user.emailConfirmation.isConfirmed) {
            this.errorMessage = 'User already confirmed'

            return false;
        }
        if(user.emailConfirmation.confirmationCode !== code){
            this.errorMessage = 'Confirmation code doesn`t match'

            return false;
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            this.errorMessage = 'Code already expired';

            return false;
        }

        return true
    }

    defaultMessage(args: ValidationArguments) {
        return this.errorMessage;
    }
}

@ValidatorConstraint({ name: 'customText', async: true })
@Injectable()
export class AuthPasswordRecoveryCodeValidation implements ValidatorConstraintInterface {
    constructor(
        protected usersRepository: UsersRepository,
      ) {}

    errorMessage: string;

    async validate(code: string, args: ValidationArguments) {        
        const user = await this.usersRepository.findUserByConfirmationCode(code)

        if (!user)  {
            this.errorMessage = 'User doesn`t exist';
            return false
        }
        if (user.emailConfirmation.confirmationCode !== code) {
            this.errorMessage = 'Confirmation code doesn`t match'

            return false;
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            this.errorMessage = 'Code already expired';

            return false;
        }

        return true
    }

    defaultMessage(args: ValidationArguments) {
        return this.errorMessage;
    }
}

@ValidatorConstraint({ name: 'customText', async: true })
@Injectable()
export class AuthReSendEmailConfirmValidation implements ValidatorConstraintInterface {
    constructor(
        protected usersRepository: UsersRepository,
      ) {}

    errorMessage: string;

    async validate(code: string, args: ValidationArguments) {        
        const user = await this.usersRepository.findUserByLoginOrEmail(code)

        if (!user)  {
            this.errorMessage = 'User doesn`t exist';
            return false
        }
        if (user.emailConfirmation.isConfirmed) {
            this.errorMessage = 'User already confirmed'

            return false;
        }
        console.log(user.emailConfirmation.nextSend);
        
        if (user.emailConfirmation.nextSend > new Date()) {            
            this.errorMessage = 'too often';

            return false;
        }

        return true
    }

    defaultMessage(args: ValidationArguments) {
        return this.errorMessage;
    }
}