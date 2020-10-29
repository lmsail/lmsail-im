import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Util } from "../../utils/util";
import { Friend } from "../../entity/friend.model";
import { AddFriendDto, HandleFriendDto } from "../../validata/friend.validata";

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(Friend)
        private readonly friendModel: Repository<Friend>, // 注入 Friend 模型
    ) {}

    /**
     * 获取用户的好友列表
     * @param uid
     */
    async findUserFriendList(uid: number): Promise<any> {
        if (!uid) return Util.Error('获取通讯录列表失败！');
        const list = await this.friendModel.query(`
            SELECT f.*, u.nickname as f_nickname, u.avatar as f_avatar FROM im_friends f LEFT JOIN im_users u ON f.user_id = u.id WHERE f.friend_id = 1 AND f.\`status\` = ${uid}
            UNION ALL
            SELECT f.*, u.nickname as f_nickname, u.avatar as f_avatar FROM im_friends f LEFT JOIN im_users u ON f.friend_id = u.id WHERE f.user_id = 1 AND f.\`status\` = ${uid}
        `);
        return Util.Success('获取通讯录列表成功！', list);
    }

    /**
     * 获取好友验证列表
     * @param uid
     */
    async findVerifyFriendList(uid: number): Promise<any> {
        if (!uid) return Util.Error('获取好友验证列表失败！');
        const list = await this.friendModel.find({ friend_id: uid });
        return Util.Success('获取好友验证列表成功！', list);
    }

    /**
     * 添加好友请求
     * @description 双向记录，方便对好友添加备注等额外操作
     * @param body
     * @param uid
     */
    async addFriendApply(body: AddFriendDto, uid: number): Promise<any> {
        const { friend_id, remark } = body;
        if(!friend_id || !uid) return Util.Error('好友请求添加失败！');
        const info = await this.friendRecord(friend_id, uid);


        
        // let result: boolean;
        // if(info) { // 如果 status = 2，则已被拒绝可重新发起好友请求
        //     if(info.status === 2) {
        //         result = await this.modifyFriendStatus(info.id, 0);
        //     }
        // } else {
        //     result = await this.insertFriendApply(uid, friend_id, remark);
        // }
        // return result ? Util.Success('好友请求发送成功！') : Util.Error('已经是好友或已发送好友申请！')
    }

    /**
     * 处理好友请求
     * @param body
     * @param uid
     */
    async handleFriendApply(body: HandleFriendDto, uid: number): Promise<any> {
        const { friend_id, option } = body;
        const info = await this.friendRecord(friend_id, uid);
        if(info) {
            const result = await this.modifyFriendStatus(info.id, option);
            return result ? Util.Success('好友请求处理成功！') : Util.Error('好友请求处理失败！');
        }
        return Util.Error('数据不存在，好友请求处理失败！');
    }

    /**
     * 获取好友申请记录
     * @param friend_id
     * @param uid
     */
    async friendRecord(friend_id: number, uid: number): Promise<Friend> {
        return await this.friendModel.findOne({
            where: [
                { friend_id, user_id: uid },
                { friend_id: uid, user_id: friend_id }
            ]
        });
    }

    /**
     * 更新好友请求状态
     * @param id
     * @param status
     */
    async modifyFriendStatus(id: number, status: number): Promise<boolean> {
        const result = await this.friendModel.save({ id, status });
        return !!result;
    }

    /**
     * 添加好友申请记录
     * @param uid
     * @param friend_id
     * @param remark
     */
    async insertFriendApply(uid: number, friend_id: number, remark: string): Promise<boolean> {
        const result = await this.friendModel.save({
            user_id: uid, friend_id, remark, created_at: Util.CurrentTime()
        });
        return !!result;
    }
}
