import { IsNotEmpty, IsInt, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

// 添加好友验证器
export class AddFriendDto {
    @ApiProperty({ description: '好友id，后续要改成好友uuid', example: 1 })
    @IsNotEmpty({ message: '缺少好友ID' })
    @IsInt({ message: '必须的整数' })
    friend_id: number

    @ApiProperty({ description: '好友验证消息', example: '你好，我是xx' })
    remark: string
}

// 处理好友请求验证器
export class HandleFriendDto {
    @ApiProperty({ description: '好友id，后续要改成好友uuid', example: 1 })
    @IsNotEmpty({ message: '缺少好友ID' })
    @IsInt({ message: '必须的整数' })
    friend_id: number

    @ApiProperty({ description: '本地消息id', example: 'local_231231' })
    local_message_id: string

    @ApiProperty({ description: '同意/拒绝 1|同意 2|拒绝', example: 1 })
    @IsNotEmpty({ message: '缺少处理状态值' })
    @IsInt({ message: '必须的整数' })
    option: number
}

// 修改好友备注验证器
export class RemarkFriendDto {
    @ApiProperty({ description: '好友id，后续要改成好友uuid', example: 2 })
    @IsNotEmpty({ message: '缺少好友ID' })
    @IsInt({ message: '必须的整数' })
    friend_id: number

    @ApiProperty({ description: '用户备注', example: '首席摸鱼官' })
    @IsNotEmpty({ message: '缺少备注' })
    @MinLength(2, { message: '备注长度不能小于2' })
    @MaxLength(6, { message: '备注长度不能超过6' })
    remark: string
}