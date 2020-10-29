import { Body, Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from './user.service';
import { UserFindDto, UserInfoDto, UserPasswordDto, UserSearchDto } from '../../validata/user.validata';
import { SsoGuard } from "../auth/guard/sso.guard";
import { CurrentUser } from '../auth/user.decorator';

@UseGuards(SsoGuard)
@Controller('user')
@ApiTags('用户模块')
@ApiBearerAuth()
// @ApiHeader({name: 'token', required: true, description: '登录成功后返回的 Token 字符串'})
export class UserController { 
    constructor(private readonly userService: UserService) {} // 注入 User 业务层

    @Post()
    @ApiOperation({ summary: '获取用户信息', description: '貌似可以越权查所有人的信息，我擦嘞～' })
    getUserInfo(@Body() userFindDto: UserFindDto, @CurrentUser() user) {
        return this.userService.findUserById(userFindDto.id || user.id);
    }
    
    @Post('search')
    @ApiOperation({ summary: '搜索用户' })
    searchFriend(@Body() userSearchDto: UserSearchDto, @CurrentUser() user) {
        return this.userService.searchUserList(userSearchDto.keyword, user.id);
    }

    @Post('info')
    @ApiOperation({ summary: '更新用户信息', description: '支持的字段分别为：`nickname|昵称` `area|地区` `mobile|手机号码` `autograph|个性签名`' })
    updateUserInfo(@Body() userInfoDto: UserInfoDto, @CurrentUser() user) {
        return this.userService.modifyUserInfo(userInfoDto, user.id);
    }

    @Post('password')
    @ApiOperation({ summary: '更新用户密码' })
    updatePassword(@Body() userPasswordDto: UserPasswordDto, @CurrentUser() user) {
        const { password, new_password } = userPasswordDto;
        return this.userService.modifyPassword(password, new_password, user.id);
    }

    @Post('avatar')
    @ApiOperation({ summary: '更新用户头像', description: '此接口请使用 `PostMan` 等工具！这里推荐 [Chrome Api调试](http://www.servistate.com/) 插件！' })
    @ApiImplicitFile({ name: 'file', required: true, description: '选择头像图片' })
    @UseInterceptors(FileInterceptor('file'))
    updateAvatar(@UploadedFile() file, @CurrentUser() user) {
        return this.userService.modifyAvatar(file, user.id);
    } 
}
