import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RemoveContactDto } from 'src/validata/contact.validata';
import { CurrentUser } from '../auth/user.decorator';
import { ContactService } from './contact.service';

@UseGuards(AuthGuard('jwt'))
@Controller('contact')
@ApiTags('会话模块')
@ApiBearerAuth()
export class ContactController {
    constructor(
        private readonly contact: ContactService,  // 注入好友 Friend 业务层
    ) {}

    @Post('remove')
    @ApiOperation({ summary: '移除指定的会话窗口' })
    removeContactItem(@Body() data: RemoveContactDto, @CurrentUser() user) {
        console.log('收到移除会话窗口的请求', data, user)
        return this.contact.removeContactItem(data.friend_id, user.id);
    }
}
