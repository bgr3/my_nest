import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../../../infrastructure/guards/jwt-auth-guard';
import { HTTP_STATUSES } from '../../../../settings/http-statuses';
import { AuthService } from '../../../auth/application/auth-service';
import { AuthDeleteAuthSessionsExcludeCurentCommand } from '../../../auth/application/use-cases/auth-delete-auth-session-exclude-current-use-case';
import { AuthDeleteSpecifiedAuthSessionByDeviceIdCommand } from '../../../auth/application/use-cases/auth-delete-specified-auth-session-by-device-id-use-case';
import { AuthGetAuthSessionsByTokenCommand } from '../../../auth/application/use-cases/auth-get-auth-session-by-token-use-case';

@Controller('security/devices')
export class SecurityController {
  constructor(
    protected authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDevices(@Req() req) {
    const deviceId = req.user;
    const sessions = await this.commandBus.execute(
      new AuthGetAuthSessionsByTokenCommand(deviceId),
    );

    if (!sessions) throw new NotFoundException();

    return sessions;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteDevices(@Req() req) {
    const deviceId = req.user;
    const result = await this.commandBus.execute(
      new AuthDeleteAuthSessionsExcludeCurentCommand(deviceId),
    );

    if (!result) throw new NotFoundException();

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':deviceId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteDevice(@Param('deviceId') deviceId: string) {
    const result = await this.commandBus.execute(
      new AuthDeleteSpecifiedAuthSessionByDeviceIdCommand(deviceId),
    );

    if (!result) throw new NotFoundException();

    return;
  }
}
