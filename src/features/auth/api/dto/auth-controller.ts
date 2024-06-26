import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';

import { JwtAuthGuard } from '../../../../infrastructure/guards/jwt-auth-guard';
import { LocalAuthGuard } from '../../../../infrastructure/guards/local-auth-guard';
import { HTTP_STATUSES } from '../../../../settings/http-statuses';
import { UsersChangePasswordCommand } from '../../../users/application/use-cases/users-change-password-use-case';
import { UsersCreateUserCommand } from '../../../users/application/use-cases/users-create-user-use-case';
import { UsersUpdateCodeForRecoveryPasswordCommand } from '../../../users/application/use-cases/users-update-code-for-recovery-password-use-case';
import { AuthChangePasswordEmailCommand } from '../../application/use-cases/auth-change-password-email-use-case';
import { AuthConfirmEmailCommand } from '../../application/use-cases/auth-confirm-email-use-case';
import { AuthCreateAuthSessionCommand } from '../../application/use-cases/auth-create-auth-session-use-case';
import { AuthDeleteAuthSessionByTokenCommand } from '../../application/use-cases/auth-delete-auth-session-by-token-use-case';
import { AuthGetMeByIdCommand } from '../../application/use-cases/auth-get-me-by-id-use-case';
import { AuthRegisterUserSendEmailCommand } from '../../application/use-cases/auth-register-user-send-email-use-case';
import { AuthResendEmailCommand } from '../../application/use-cases/auth-resend-email-use-case';
import { AuthUpdateTokensCommand } from '../../application/use-cases/auth-update-tokens-use-case';
import {
  AuthEmailResendingDTO,
  AuthNewPasswordDTO,
  AuthPasswordRecoveryDTO,
  AuthRegistrationConfirmationDTO,
  AuthRegistrationDTO,
} from './input/auth-input-dto';
import { LoginResponseType, MeType } from './output/auth-output-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HTTP_STATUSES.OK_200)
  async loginUser(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseType> {
    const deviceName: string = req.header('User-Agent')
      ? req.header('User-Agent')!
      : 'unknown device';

    const result = await this.commandBus.execute(
      new AuthCreateAuthSessionCommand(req.user.id, req.ip, deviceName),
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: result.accessToken };
  }

  @Post('password-recovery')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async passwordRecovery(@Body() dto: AuthPasswordRecoveryDTO): Promise<void> {
    const userId = await this.commandBus.execute(
      new UsersUpdateCodeForRecoveryPasswordCommand(dto.email),
    );

    if (userId) {
      await this.commandBus.execute(new AuthChangePasswordEmailCommand(userId));
    }

    return;
  }

  @Post('new-password')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async newPassword(@Body() dto: AuthNewPasswordDTO): Promise<void> {
    const result = await this.commandBus.execute(
      new UsersChangePasswordCommand(dto.recoveryCode, dto.newPassword),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  @HttpCode(HTTP_STATUSES.OK_200)
  async refreshToken(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseType> {
    const deviceId = req.user;

    const tokens = await this.commandBus.execute(
      new AuthUpdateTokensCommand(deviceId),
    );

    if (!tokens) throw new NotFoundException(); //new HttpException('NOT_FOUND', HTTP_STATUSES.UNAUTHORIZED_401);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async logout(@Req() req): Promise<void> {
    const deviceId = req.user;

    const result = await this.commandBus.execute(
      new AuthDeleteAuthSessionByTokenCommand(deviceId),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.UNAUTHORIZED_401);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async aboutMe(@Req() req): Promise<MeType> {
    const userId = req.user;

    const me = await this.commandBus.execute(new AuthGetMeByIdCommand(userId));

    return me;
  }

  @Post('registration')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async registration(@Body() dto: AuthRegistrationDTO): Promise<void> {
    const result = await this.commandBus.execute(
      new UsersCreateUserCommand(dto),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.BAD_REQUEST_400);

    const email = await this.commandBus.execute(
      new AuthRegisterUserSendEmailCommand(result),
    );

    if (!email)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.BAD_REQUEST_400);

    return;
  }

  @Post('registration-confirmation')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async registrationConfirmation(
    @Body() dto: AuthRegistrationConfirmationDTO,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new AuthConfirmEmailCommand(dto.code),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.BAD_REQUEST_400);

    return;
  }

  @Post('registration-email-resending')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async emailResending(@Body() dto: AuthEmailResendingDTO): Promise<void> {
    const result = await this.commandBus.execute(
      new AuthResendEmailCommand(dto.email),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.BAD_REQUEST_400);

    return;
  }
}
