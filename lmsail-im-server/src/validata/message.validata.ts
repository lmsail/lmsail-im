import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

// 查询聊天记录验证器
export class FindMessageDto {
    @ApiProperty({ description: '好友ID', example: 2 })
    @IsNotEmpty({ message: '缺少好友ID' })
    friend_id: number

    @ApiProperty({ description: '页码，不填默认为0', default: 0, example: 1 })
    page: number
}