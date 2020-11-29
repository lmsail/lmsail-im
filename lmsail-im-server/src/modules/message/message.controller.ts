import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { FindMessageDto } from 'src/validata/message.validata';
import { CurrentUser } from '../auth/user.decorator';
import { MessageService } from './message.service';

@UseGuards(AuthGuard('jwt'))
@Controller('message')
@ApiTags('消息模块')
@ApiBearerAuth()
export class MessageController {
    constructor(private readonly messageService: MessageService) {} // 注入好友 Message 业务层

    @Post('list')
    @ApiOperation({ summary: '获取好友聊天记录' })
    findFriendList(@Body() findMessage: FindMessageDto, @CurrentUser() user) {
        return this.messageService.getMessageList(findMessage, user.id);
    }

    @Post('upload')
    @ApiOperation({ summary: '通用上传图片接口', description: '此接口请使用 `PostMan` 等工具！这里推荐 [Chrome Api调试](http://www.servistate.com/) 插件！' })
    @ApiImplicitFile({ name: 'file', required: true, description: '选择图片' })
    @UseInterceptors(FileInterceptor('file'))
    update(@UploadedFile() file) {
        return this.messageService.handleImgUpload(file);
    } 
}
