import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";
import { Util } from 'src/utils/util';

@Entity({ name: 'im_friends' })
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ comment: '用户ID' })
    user_id: number;

    @ApiProperty()
    @Column({ comment: '好友ID' })
    friend_id: number;

    @ApiProperty({ description: '该字段作用是为了可以查出历史验证消息（谁加的我）' })
    @Column({ comment: '发起人ID' })
    target_id: number;

    @ApiProperty()
    @Column({ comment: '好友申请时的备注信息' })
    remark: string;

    @ApiProperty()
    @Column({ comment: '对friend_id的备注' })
    nick_remark: string;

    @ApiProperty()
    @Column({ comment: '0: 申请状态 | 1: 好友状态 | 2: 申请被拒 | 3: 已被对方移除', type: 'tinyint' })
    status: number;

    @ApiProperty({ description: '创建时间' })
    @Column({ default: Util.CurrentTime() })
    created_at: string;
}
