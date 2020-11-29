import { Injectable } from "@nestjs/common";
import { User } from "src/entity/user.model";
import { Util } from "src/utils/util";
import { AddFriendDto, HandleFriendDto } from "src/validata/friend.validata";
import { CacheService } from "../cache/cache.service";
import { ContactService } from "../contact/contact.service";
import { FriendService } from "../friend/friend.service";
import { MessageService } from "../message/message.service";
import { UserService } from "../user/user.service";

@Injectable()
export class EventsService {
    constructor(
        private readonly friendService: FriendService,
        private readonly contactService: ContactService,
        private readonly cache: CacheService,
        private readonly message: MessageService,
        private readonly userService: UserService
    ) {}

    /**
     * 处理收到消息事件
     * @param id 
     * @param friend_id 
     * @param message   类型为pic时，会话列表message显示为[图片]
     * @param type      消息类型：text|pic 
     */
    async handleMessEvent(id: number, friend_id: number, local_message_id: string, message: string, type: string): Promise<any> {
        const data = this.handleMessage(message, type); // 根据消息内容进行处理
        const { realMessage, lastMessage } = data;
        await this.addSessionRecord(id, friend_id, lastMessage); // 添加会话记录
        await this.message.insertMessage(id, friend_id, local_message_id, realMessage, type); // 添加消息记录
        await this.contactService.removeUnreadNum(id, friend_id); // 清空消息未读数
        return await this.friendService.findSendUserInfo(id, friend_id); // 返回发送人基础信息
    }

    /**
     * 根据消息内容，处理消息内容
     * @param message 
     * @param type 
     */
    handleMessage(message: string, type: string): any {
        let lastMessage = message;
        if(type === 'pic') { // 图片消息
            lastMessage = '[图片]';
        } else {
            message = message.replace(/<[^>]+>/g, '') // 删除所有html标签
            if(message.length <= 0) message = '[不支持的消息内容]';
            if(message.length > 500) message = message.slice(0, 500) + '...';
        }
        return { realMessage: message, lastMessage };
    }

    /**
     * 处理 join 事件
     * @param id 
     * @param friend_id 
     */
    async handleJoinEvent(id: number, friend_id: number): Promise<any> {
        await this.contactService.removeUnreadNum(id, friend_id); // 清空消息未读数
        return await this.getMessageList(id, friend_id); // 获取聊天记录
    }

    /**
     * 处理 withdraw 消息撤回事件
     * @param data { message_id, user_id, friend_id }
     */
    async handleWithDrawEvent(data: any, username: string): Promise<any> {
        const { message_id, user_id, friend_id } = data;
        if(!message_id) return Util.Error("消息撤回失败！！");
        const isMinMsg = await this.message.isMySelfMessage(message_id, user_id);
        if(isMinMsg) {
            const message = `${username}撤回了一条消息`;
            const response = await this.message.withDrawMessage(data, message);
            if(response.code === 200) {
                return await this.addSessionRecord(user_id, friend_id, '[消息撤回]');
            }
            return Util.Error(response.message);
        }
        return Util.Error('非本人发送的消息，不可撤回');
    }

    /**
     * 添加好友
     * @param data 
     */
    async addFiendVerify(data: AddFriendDto, user_id: number): Promise<Boolean | User> {
        const response = await this.friendService.addFriendApply(data, user_id);
        if(response.code === 200) {
            const userInfo = await this.userService.findUserById(user_id);
            if(userInfo.code === 200) {
                return userInfo.data;
            }
            return false;
        }
        return false;
    }

    /**
     * 处理好友申请
     * @param data { friend_id, option }
     * @param user_id 
     */
    async handleFriend(data: HandleFriendDto, user_id: number): Promise<Boolean> {
        const response = await this.friendService.handleFriendApply(data, user_id);
        if(response.code === 200) {
            if(data.option === 1) { // 动作是通过则自动发送打招呼信息
                const { friend_id, local_message_id } = data
                const messRes = await this.message.insertMessage(user_id, friend_id, local_message_id, '我们已经是好友啦', 'text');
                const sessRes = await this.addSessionRecord(user_id, friend_id, '我们已经是好友啦');
                return messRes.code === 200 && sessRes;
            }
        }
        return false;
    }

    /**
     * 获取在线的好友
     * @param uid 
     */
    async getOnlineFriend(uid: number, onlineUser: number[]): Promise<number[]> {
        const response = await this.friendService.findUserFriendList(uid);
        let friendOnline: number[] = [];
        if(response.code === 200 && response.data.length > 0) {
            let friendIds: number[] = [];
            response.data.map(item => friendIds.push(item.id));
            friendOnline = friendIds.filter(id => onlineUser.indexOf(id) > -1 && id !== uid);
        }
        return friendOnline;
    }

    /**
     * 获取历史会话列表
     * @param uid 
     */
    async getSessionList(uid: number): Promise<any> {
        return await this.contactService.findSessionList(uid);
    }

    /**
     * 获取用户通讯录列表
     * @param uid 
     */
    async getUserFriendList(uid: number): Promise<any> {
        const mailList = await this.friendService.findUserFriendList(uid);
        if(mailList && mailList.code === 200) {
            return mailList.data;
        }
        return [];
    }

    /**
     * 获取好友申请数量
     * @param uid 
     */
    async getNewFriendNum(uid: number): Promise<number> {
        return await this.friendService.findVerifyFriendCount(uid);
    }

    /**
     * 检测是否为好友关系
     * @param uid 
     * @param to_uid 
     */
    async isFriend(uid: number, to_uid: number): Promise<boolean> {
        return await this.friendService.friendRecord(to_uid, uid);
    }

    /**
     * 添加会话记录
     * @param uid 
     * @param friend_id 
     * @param message 
     */
    async addSessionRecord(uid: number, friend_id: number, message: string): Promise<boolean> {
        const forward = await this.contactService.addForwardContactRecord(uid, friend_id, message);
        const reverse = await this.contactService.addReverseContactRecord(uid, friend_id, message);
        return forward && reverse;
    }

    /**
     * 获取历史消息记录
     * @param id 
     * @param friend_id 
     */
    async getMessageList(id: number, friend_id: number): Promise<any> {
        return await this.message.findMessageList(id, friend_id);
    }

    /**
     * 检测用户token是否过期
     * @param token 
     */
    async chkUserToken(token: string, username: string): Promise<boolean> {
        const cacheToken = await this.cache.client.hget('tokens', Util.Md5(username));
        return token === cacheToken;
    }
}