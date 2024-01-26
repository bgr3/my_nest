import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Req,
  UseGuards,
  Res,
  NotFoundException,
  Get
} from '@nestjs/common';
import { LocalAuthGuard } from '../../../../infrastructure/guards/local-auth-guard';
import { AuthService } from '../../application/auth-service';
import { Request, Response } from 'express';
import { UsersService } from '../../../users/application/users-service';
import { AuthEmailResendingDTO, AuthNewPasswordDTO, AuthPasswordRecoveryDTO, AuthRegistrationConfirmationDTO, AuthRegistrationDTO } from './input/auth-input-dto';
import { HTTP_STATUSES } from '../../../../settings/http-statuses';
import { JwtAuthGuard } from '../../../../infrastructure/guards/jwt-auth-guard';
import { BasicAuthGuard } from '../../../../infrastructure/guards/basic-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post('login')
  async loginUser(@Req() req, @Res() res: Response) {
    
    const deviceName: string = req.header('User-Agent')
      ? req.header('User-Agent')!
      : 'unknown device';

    const result = await this.authService.createAuthSession(req.user.id, req.ip, deviceName);

    res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true});

    return res.send({accessToken: result.accessToken})
  }

  @Post('password-recovery')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async passwordRecovery(@Body() dto: AuthPasswordRecoveryDTO) {
    
    const userId = await this.usersService.updateCodeForRecoveryPassword(dto.email)
    
    if(userId) {
      const result = await this.authService.changePasswordEmail(userId)  
    }
    
    return  ;
  }

  @Post('new-password')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async newPassword(@Body() dto: AuthNewPasswordDTO) {
    const result = await this.usersService.changePassword(dto.recoveryCode, dto.newPassword)

    if (!result) throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return ;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response)  {

    const oldRefreshToken = req.cookies.refreshToken
  
    const tokens = await this.authService.updateTokens(oldRefreshToken)
  
    if (!tokens) throw new NotFoundException() //new HttpException('NOT_FOUND', HTTP_STATUSES.UNAUTHORIZED_401);
    
    
    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true});

    return res.send({accessToken: tokens.accessToken})
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async logout(@Req() req: Request)  {
    const oldRefreshToken = req.cookies.refreshToken;
  
    const result = await this.authService.deleteAuthSessionByToken(oldRefreshToken);
  
    if (!result) throw new HttpException('NOT_FOUND', HTTP_STATUSES.UNAUTHORIZED_401);
    
    return ;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async aboutMe(@Req() req: Request) {
    const accessToken = req.headers.authorization!.split(' ')[1]
    let me = await this.authService.getMeByToken(accessToken)
    return me;
  }

  @Post('registration')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async registration(@Body() dto: AuthRegistrationDTO)  {
    const result = await this.usersService.createUser(dto)
    
    if (!result) throw new HttpException('NOT_FOUND', HTTP_STATUSES.BAD_REQUEST_400);

    const email = await this.authService.registerUserSendEmail(result)  

    if (!email) throw new HttpException('NOT_FOUND', HTTP_STATUSES.BAD_REQUEST_400);

    return ;
  }

  @Post('registration-confirmation')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async registrationConfirmation(@Body() dto: AuthRegistrationConfirmationDTO)  {
    const result = await this.authService.confirmEmail(dto.code)

    if (!result) throw new HttpException('NOT_FOUND', HTTP_STATUSES.BAD_REQUEST_400);

    return ;
  }

  @Post('registration-email-resending')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async emailResending(@Body() dto: AuthEmailResendingDTO)  {
    const result = await this.authService.ReSendEmail(dto.email)

    if (!result) throw new HttpException('NOT_FOUND', HTTP_STATUSES.BAD_REQUEST_400);

    return ;
  }
}
