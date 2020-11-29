import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/entity/friend.model';
import { UserInfoDto } from 'src/validata/user.validata';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.model';
import { Util } from '../../utils/util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userModel: Repository<User>, // 注入 User 模型
        @InjectRepository(Friend) private readonly friendModel: Repository<Friend>, // 注入 Friend 模型
    ) {}

    /**
     * 搜索用户
     * @param keyword 
     * @param uid
     * @description 同时要排除自己的好友
     */
    async searchUserList(keyword: string, uid: number): Promise<any> {
        let userList = await this.userModel.query(`SELECT id, nickname, avatar, area, autograph FROM im_users WHERE nickname like '%${keyword}%' ORDER BY id DESC`);
        if(userList.length > 0) {
            // 查出用户好友列表，将好友排除
            const friendList = await this.findUserFriendList(uid);
            userList.map((item, key) => {
                const index = friendList.findIndex(user_id => user_id === item.id);
                if(index >= 0) userList.splice(key, 1);
                return item;
            });
        }
        return Util.Success('获取成功', userList)
    }

    /**
     * 获取指定用户信息
     * @param uid  用户id
     */
    async findUserById(id: number): Promise<any> {
        const userInfo = await this.userModel.findOne(id);
        return Util._Rs(Boolean(userInfo), '获取成功!!', '获取失败!!', userInfo);
    }

    /**
     * 更新用户昵称
     * @param userInfo { fieldName: '', fieldValue: '' }
     * @param id
     */
    async modifyUserInfo(userInfo: UserInfoDto, id: number): Promise<any> {
        const { fieldName, fieldValue } = userInfo;
        const fieldList: string[] = ['nickname', 'area', 'mobile', 'autograph']; // 支持修改的字段集合 
        if(fieldList.indexOf(fieldName) < 0) return Util.Error('非法请求!!');
        const result = await this.userModel.query(`
            UPDATE im_users SET ${fieldName} = '${fieldValue}' WHERE id = ${id}
        `);
        return Util._Rs(Boolean(result), '用户信息修改成功!!', '用户信息修改失败!!');
    }

    /**
     * 更新用户密码
     * @param password
     * @param new_password
     * @param uid
     */
    async modifyPassword(password: string, new_password: string, id: number): Promise<any> {
        const userInfo = await this.userModel.findOne(id);
        if(!userInfo) return Util.Error('查无此人！');
        if(userInfo.password !== Util.Md5(password))
            return Util.Error('旧密码输入有误！');
        const result = await this.userModel.save({ id, password: Util.Md5(new_password)});
        return Util._Rs(Boolean(result), '密码修改成功!!', '密码修改失败!!');
    }

    /**
     * 修改用户头像
     * @param file
     * @param uid
     */
    async modifyAvatar(file, id: number): Promise<any> {
        if(!file) return Util.Error('文件上传错误!!');
        const filePath = Util.upload(file, 'avatar');
        if(!filePath) return Util.Error('文件上传错误!!');
        const result = await this.userModel.save({ id, avatar: filePath });
        return Util._Rs(Boolean(result), '头像修改成功!!', '头像修改失败!!', filePath);
    }

    /**
     * 获取好友列表
     * @param uid 
     */
    async findUserFriendList(uid: number): Promise<number[]> {
        let friendList: number[] = [];
        const list = await this.friendModel.query(`
            SELECT
                f1.id, f1.user_id, f1.friend_id, f1.nick_remark,
                u.nickname, u.avatar, u.area, u.autograph, u.created_at,
                IF(u.mobile, CONCAT(LEFT(u.mobile, 3), '******', RIGHT(u.mobile, 2)), '') as mobile
            FROM
                im_friends f1
            INNER JOIN 
                im_friends f2 ON f1.user_id = f2.friend_id AND f1.friend_id = f2.user_id
            LEFT JOIN 
                im_users u ON f1.friend_id = u.id 
            WHERE
                f1.user_id = ${uid}
            ORDER BY
                f1.id DESC
        `);
        if(list.length > 0) {
            list.map(item => friendList.push(item.friend_id));
        }
        return friendList;
    }
}
