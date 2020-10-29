import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
