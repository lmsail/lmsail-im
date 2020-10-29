import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";
import { Util } from 'src/utils/util';

// 会话列表
@Entity({ name: 'im_contacts' })
export class Contacts {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ comment: '用户ID' })
    user_id: number;

    @ApiProperty()
    @Column({ comment: '好友ID' })
    friend_id: number;

    @ApiProperty()
    @Column({ comment: '最后一条信息' })
    last_mess: string;

    @ApiProperty()
    @Column({ comment: '未读数量' })
    unread_num: number;

    @ApiProperty({ description: '创建时间' })
    @Column({ default: Util.CurrentTime() })
    created_at: string;
}
