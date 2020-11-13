import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

// 移除会话窗口的验证器
export class RemoveContactDto {
    @ApiProperty({ description: '好友id', example: 1 })
    @IsNotEmpty({ message: '缺少好友ID' })
    friend_id: number
}
