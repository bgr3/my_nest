import { IsEmail, IsString, Length } from "class-validator";

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
  recoveryCode: string;
}

export class AuthRegistrationDTO {
  @Length(3, 10)
  login: string;

  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;
}

export class AuthRegistrationConfirmationDTO {
  @IsString()
  code: string;
}

export class AuthEmailResendingDTO {
  @IsEmail()
  email: string;
}
