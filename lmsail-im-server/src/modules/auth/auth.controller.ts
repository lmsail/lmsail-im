import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLogin, AuthRegister } from '../../validata/user.validata';
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
@ApiTags('登录、注册')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: '用户登录获取 Token' })
    async login(@Body() auth: AuthLogin) {
        console.log('收到的登录信息', auth)
        return await this.authService.login(auth);
    }

    @Post('register')
    @ApiOperation({ summary: '用户注册' })
    async register(@Body() register: AuthRegister) {
        return await this.authService.register(register);
    }

    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '用户注销销毁 Token' })
    async logout(@Request() req) {
        return await this.authService.logout(req);
    }
}
