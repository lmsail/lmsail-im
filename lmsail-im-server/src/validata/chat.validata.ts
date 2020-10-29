import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

// 聊天通用验证器
export class ChatDto {
    @ApiProperty({ description: '用户登录标识' })
    @IsNotEmpty({ message: '缺少用户登录标识' })
    token: number

    @ApiProperty({ description: '好友id', example: 1 })
    @IsNotEmpty({ message: '缺少好友ID' })
    friend_id: number
}
