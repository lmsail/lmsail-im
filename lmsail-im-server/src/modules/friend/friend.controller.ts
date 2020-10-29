import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { FriendService } from "./friend.service";
import { AddFriendDto, HandleFriendDto, RemarkFriendDto } from "../../validata/friend.validata";
import { CurrentUser } from '../auth/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('friend')
@ApiTags('好友模块')
@ApiBearerAuth()
// @ApiHeader({ name: 'token', required: true, description: '登录成功后返回的 Token 字符串' })
export class FriendController {
    constructor(private readonly friendService: FriendService) {} // 注入好友 Friend 业务层

    @Post()
    @ApiOperation({ summary: '获取好友列表', description: '此接口只返回互为好友的通讯录列表，即存在 `双向记录` 的数据' })
    findFriendList(@Request() req) {
        return this.friendService.findUserFriendList(req.user.id);
    }

    @Post('verify')
    @ApiOperation({ summary: '获取好友申请列表' })
    verifyFriendList(@Request() req) {
        return this.friendService.findVerifyFriendList(req.user.id);
    }

    @Post('add')
    @ApiOperation({ summary: '添加好友/发送好友请求' })
    sendFriendRequest(@Body() addFriendDto: AddFriendDto, @Request() req) {
        return this.friendService.addFriendApply(addFriendDto, req.user.id);
    }

    @Post('handle')
    @ApiOperation({ summary: '处理好友请求' })
    handleFriendRequest(@Body() handleFriendDto: HandleFriendDto, @Request() req) {
        return this.friendService.handleFriendApply(handleFriendDto, req.user.id);
    }

    @Post('remark')
    @ApiOperation({ summary: '修改好友备注' })
    updateFriendRemark(@Body() remarkFriendDto: RemarkFriendDto, @CurrentUser() user) {
        return this.friendService.modifyFriendRemark(remarkFriendDto, user.id);
    }
}
