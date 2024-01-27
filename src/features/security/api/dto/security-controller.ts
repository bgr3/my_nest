import { Controller, Delete, Get, HttpCode, NotFoundException, Param, Req, UseGuards } from "@nestjs/common"
import { AuthService } from "../../../auth/application/auth-service"
import { JwtAuthGuard } from "../../../../infrastructure/guards/jwt-auth-guard"
import { HTTP_STATUSES } from "../../../../settings/http-statuses";

@Controller('security/devices')
export class SecurityController {
    constructor(protected authService: AuthService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDevices(@Req() req) {
        const refreshToken = req.payload;
        const sessions = await this.authService.getAuthSessionsByToken(refreshToken)
    
        if (!sessions) throw new NotFoundException();

        return sessions;    
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteDevices(@Req() req) {
        const refreshToken = req.payload;
        const result = await this.authService.deleteAuthSessionsExcludeCurent(refreshToken);
    
        if (!result) throw new NotFoundException();
        
        return ;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':deviceId')
    async deleteDevice(@Param() deviceId: string) {
        const result = await this.authService.deleteSpecifiedAuthSessionByDeviceId(deviceId)
    
        if (!result) throw new NotFoundException();
        
        return ;  
    }
}