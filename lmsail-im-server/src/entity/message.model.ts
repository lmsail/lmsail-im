import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";
import { Util } from 'src/utils/util';

// 消息记录表
@Entity({ name: 'im_message' })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ comment: '发送方用户id' })
    send_id: number;

    @ApiProperty()
    @Column({ comment: '接收方用户id' })
    recv_id: number;

    @ApiProperty()
    @Column({ comment: '消息内容' })
    message: string;

    @ApiProperty()
    @Column({ comment: '是否被撤回', default: 1 })
    status: number;

    @ApiProperty({ description: '创建时间' })
    @Column({ default: Util.CurrentTime() })
    created_at: string;
}
