import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Util } from "../../utils/util";
import { Friend } from "../../entity/friend.model";
import { AddFriendDto, HandleFriendDto, RemarkFriendDto } from "../../validata/friend.validata";

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
            SELECT
                f1.id, f1.user_id, f1.friend_id, f1.nick_remark,
                u.nickname, u.avatar, u.area, u.autograph, u.created_at,
                IF(u.mobile, CONCAT(LEFT(u.mobile, 3), '******', RIGHT(u.mobile, 2)), '') as mobile
            FROM
                im_friends f1
                INNER JOIN im_friends f2 ON f1.user_id = f2.friend_id AND f1.friend_id = f2.user_id
                LEFT JOIN im_users u ON f1.friend_id = u.id 
            WHERE
                f1.user_id = ${uid}
            ORDER BY
                f1.id DESC
        `);
        return Util.Success('获取通讯录列表成功！', list);
    }

    /**
     * 查询好友信息
     * @param id 
     * @param friend_id 
     */
    async findSendUserInfo(id: number, friend_id: number): Promise<any> {
        const response = await this.friendModel.query(`
            SELECT 
                f.id, f.user_id, f.friend_id, f.nick_remark,
                u.nickname, u.avatar, u.area, u.autograph,
                c.last_mess, c.unread_num, c.created_at,
                IF(u.mobile, CONCAT(LEFT(u.mobile, 3), '******', RIGHT(u.mobile, 2)), '') as mobile
            FROM 
                im_friends f
                LEFT JOIN im_users u ON f.user_id = u.id
                LEFT JOIN im_contacts c ON c.user_id = f.friend_id AND c.friend_id = f.user_id
            WHERE f.user_id = ${id} AND f.friend_id = ${friend_id}
            limit 1 
        `);
        return response ? response[0] : {}

        // return this.friendModel.findOne({
        //     where: { user_id: id, friend_id },
        //     select: ['id', 'user_id', 'friend_id', 'nick_remark'],
        // });
    }

    /**
     * 获取好友验证列表
     * @param uid
     */
    async findVerifyFriendList(uid: number): Promise<any> {
        if (!uid) return Util.Error('获取好友验证列表失败！');
        const list = await this.friendModel.query(`
            SELECT
                f.id, f.user_id, f.friend_id, f.remark, f.created_at, f.status,
                u.nickname, u.avatar
            FROM
                im_friends f
                LEFT JOIN im_users u ON f.user_id = u.id
            WHERE
                f.friend_id = ${uid} AND f.target_id != ${uid}
            ORDER BY
                f.status ASC
        `);
        return Util.Success('获取好友验证列表成功！', list);
    }

    /**
     * 获取好友申请数量
     * @param uid 
     */
    async findVerifyFriendCount(uid: number): Promise<number> {
        return await this.friendModel.count({
            where: { friend_id: uid, target_id: Not(uid), status: 0 }
        });
    }

    /**
     * 添加好友请求
     * @description 双向记录，方便对好友添加备注等额外操作
     * @param body
     * @param uid
     */
    async addFriendApply(body: AddFriendDto, user_id: number): Promise<any> {
        const { friend_id, remark } = body;
        if(!friend_id || !user_id) return Util.Error('好友请求添加失败！');
        if(friend_id === user_id) return Util.Error('不能添加自己为好友！');
        const info = await this.friendModel.findOne({ user_id, friend_id });
        if(!info) {
            const result = await this.insertFriendApply(user_id, friend_id, remark);
            return Util._Rs(Boolean(result), '好友请求发送成功！', '已经是好友或已发送好友申请！');
        }
        return await this.handleAddRequest(info);
    }

    /**
     * 处理好友请求
     * @param body { friend_id, option } option: 1:同意 | 2：拒绝
     * @param uid
     * @description 处理的数据是别人加我的，所以此时：friend_id 对应的我自己 uid
     */
    async handleFriendApply(body: HandleFriendDto, uid: number): Promise<any> {
        const { friend_id, option } = body;
        const info = await this.friendModel.findOne({ friend_id: uid, user_id: friend_id });
        if(!info || info.status !== 0) return Util.Error('当前记录无需处理!!');
        if(option === 1) { // 同意
            const record = await this.chkAndInsertFriendApply(uid, friend_id, '我们已经是好友啦，开始聊天吧！', 1);
            const result = await this.modifyFriendStatus(info.id, option);
            return Util._Rs(Boolean(record && result), '好友请求处理成功！', '好友请求处理失败！');
        } else { // 拒绝 
            const result = await this.modifyFriendStatus(info.id, option);
            return Util._Rs(Boolean(result), '好友请求处理成功！', '好友请求处理失败！');
        }
    }

    /**
     * 修改好友备注
     * @param body { friend_id, remark }
     * @param uid 
     */
    async modifyFriendRemark(body: RemarkFriendDto, uid: number): Promise<any> {
        const { friend_id, remark } = body;
        const info = await this.friendRecord(friend_id, uid, true);
        if(info && info.status === 1) {
            const result = await this.friendModel.save({ id: info.id, nick_remark: remark });
            return Util._Rs(Boolean(result), '备注修改成功!!', '备注修改失败!!');
        }
        return Util.Error('你们还不是好友哦!!');
    }

    /**
     * 处理好友申请
     * @param info 
     */
    async handleAddRequest(info: Friend) {
        switch(info.status) {
            case 0: // 已存在申请记录
                return Util.Error('已发送申请，请等待好友验证！'); 
            case 1: // 互为好友
                return Util.Error('你们已经是好友了！'); 
            case 2: // status = 2 | 3 时将状态改为 0
                const result = await this.modifyFriendStatus(info.id, 0); 
                return result ? Util.Success('好友请求发送成功！') : Util.Error('已经是好友或已发送好友申请！');
            default: // 互为好友
                return Util.Error('非法操作！'); 
        }
    }

    /**
     * 检测是否为好友关系
     * @param friend_id
     * @param uid
     */
    async friendRecord(friend_id: number, uid: number, type?: boolean): Promise<any> {
        const info = await this.friendModel.findOne({ friend_id, user_id: uid });
        return type ? info : !!(info && info.status === 1);
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
    async insertFriendApply(uid: number, friend_id: number, remark: string, status?: number): Promise<boolean> {
        const result = await this.friendModel.save({
            user_id: uid, friend_id, target_id: uid, remark: remark || '你好，交个朋友吧！', status, created_at: Util.CurrentTime()
        });
        return !!result;
    }

    /**
     * 添加好友申请记录并检查记录是否存在
     * @param uid
     * @param friend_id
     * @param remark
     */
    async chkAndInsertFriendApply(uid: number, friend_id: number, remark: string, status?: number): Promise<boolean> {
        // 先检查是否存在该条记录，不存在再添加
        const info = await this.friendModel.findOne({ user_id: uid, friend_id });
        if(info) return true;
        const result = await this.friendModel.save({
            user_id: uid, friend_id, target_id: friend_id, remark, status, created_at: Util.CurrentTime()
        });
        return !!result;
    }
}
