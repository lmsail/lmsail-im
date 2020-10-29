import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";
import { Util } from 'src/utils/util';

@Entity({name: 'im_users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: '用户标识，将于下一版本替换用户id' })
    unique_id: string;

    @ApiProperty({ description: '用户名' })
    @Column()
    username: string;

    @ApiProperty({ description: '昵称' })
    @Column()
    nickname: string;

    @ApiProperty({ description: '密码' })
    @Column()
    password: string;

    @ApiProperty({ description: '头像' })
    @Column()
    avatar: string;

    @ApiProperty({ description: '手机号' })
    @Column()
    mobile: string;

    @ApiProperty({ description: '地区' })
    @Column()
    area: string;

    @ApiProperty({ description: '个性签名' })
    @Column()
    autograph: string;

    @ApiProperty({ description: '状态 1：正常 0：禁用' })
    @Column({ default: 1, type: 'tinyint' })
    status: number;

    @ApiProperty({ description: '创建时间' })
    @Column({ default: Util.CurrentTime() })
    created_at: string;
}
