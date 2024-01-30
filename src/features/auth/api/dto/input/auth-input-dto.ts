import { IsEmail, IsString, Length, Validate } from "class-validator";
import { AuthEmailConfirmValidation, AuthPasswordRecoveryCodeValidation, AuthReSendEmailConfirmValidation, UserEmailValidation, UserLoginValidation } from "./auth-input-validator";

export class AuthLoginInputDTO {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;

}

export class AuthPasswordRecoveryDTO {
  @IsEmail()
  email: string;
}

export class AuthNewPasswordDTO {
  @Length(6, 20)
  newPassword: string;

  @IsString()
  @Validate(AuthPasswordRecoveryCodeValidation)
  recoveryCode: string;
}

export class AuthRegistrationDTO {
  @Length(3, 10)
  @Validate(UserLoginValidation)
  login: string;

  @IsEmail()
  @Validate(UserEmailValidation)
  email: string;

  @Length(6, 20)
  password: string;
}

export class AuthRegistrationConfirmationDTO {
  @IsString()
  @Validate(AuthEmailConfirmValidation)
  code: string;
}

export class AuthEmailResendingDTO {
  @IsEmail()
  @Validate(AuthReSendEmailConfirmValidation)
  email: string;
}
