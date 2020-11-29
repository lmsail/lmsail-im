import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import * as jwt from 'jsonwebtoken';
import { Util } from 'src/utils/util';
import { User } from 'src/entity/user.model';
import { jwtConstants } from 'src/config/app.pro';
import { UserService } from '../user/user.service';
import { EventsService } from './events.service';
import { HandleFriendDto } from 'src/validata/friend.validata';

@WebSocketGateway()
export class EventsGateway {

    constructor(
        private readonly userService: UserService,
        private readonly eventService: EventsService
    ) {}

    @WebSocketServer()
    server: Server;

    onlineUser: number[] = []; // 存放所有在线的用户id

    /**
     * socket 连接时触发
     * @param client
     * @description handleConnection 在 WsJwtGuard 之前，所以这里要再次解析token，暂时还没想到其它好的办法
     * @response userInfo: 用户信息 | sessionList：历史会话列表 | onlineFriend：在线的好友
     */
    async handleConnection(@ConnectedSocket() client: Socket): Promise<any> {
        try {
            const { token } = client.handshake.query;
            const user: User = <User> jwt.verify(token, jwtConstants.secret);

            // 比对用户 token 信息是否过期
            const isOverdue = await this.eventService.chkUserToken(token, user.username);
            if(!isOverdue) return this.server.emit('authError');

            client.join(String(user.id)); client['user'] = user;
            this.onlineUser = [...this.onlineUser, user.id];

            const { data: userInfo } = await this.userService.findUserById(user.id);
            this.server.to(String(user.id)).emit('init', Util.Success('获取成功', {
                userInfo,
                sessionList: await this.eventService.getSessionList(user.id),
                mailList: await this.eventService.getUserFriendList(user.id),
                newFriendNum: await this.eventService.getNewFriendNum(user.id), // 好友申请
                onlineFriend: await this.eventService.getOnlineFriend(user.id, this.onlineUser)
            })); 
            // 用户上线了，给当前上线的在线好友广播消息，用来更新好友在线状态
            // do something... do what ？
        } catch (err) {
            this.server.emit('authError');
        } 
    }

    /**
     * 订阅指令 join 的消息
     * @param client
     * @param data  { friend_id: 2 }
     * @description 点开了好友聊天窗口时触发; join规则，按用户id从小到大连接；eg：1-2
     */
    @SubscribeMessage('join')
    async handleJoinEvent(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<any> {
        const { friend_id } = data; const { id } = client['user'];
        const isFriend = await this.eventService.isFriend(id, friend_id);
        if(!isFriend) {
            this.server.to(id).emit('join', Util.Error('非好友关系，请先添加好友！'));
            return false;
        }
        const list = await this.eventService.handleJoinEvent(id, friend_id);
        this.server.to(id).emit('join', { user_id: id, friend_id, list });
    }

    /**
     * 订阅指令 leave 的消息
     * @param client
     * @param data  { friend_id: 2 }
     * @description 离开了好友聊天窗口时触发
     */
    @SubscribeMessage('leave')
    async handleLeaveEvent(@ConnectedSocket() client: Socket, @MessageBody() data): Promise<any> {
        const { friend_id } = data; const { id } = client['user'];
        const roomID = id > friend_id ? friend_id + '' + id : id + '' + friend_id;
        client.leave(roomID);
    }

    /**
     * 订阅指令 message 的消息
     * @param client
     * @param data { message: '', friend_id: 1, local_message_id: '前端本地消息id', type: '消息类型|text/pic' }
     */
    @SubscribeMessage('message')
    async handleMessageEvent(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<void> {
        const { friend_id, local_message_id, message, type } = data; const { id } = client['user'];
        const sendUserInfo = await this.eventService.handleMessEvent(id, friend_id, local_message_id, message, type);
        if(sendUserInfo) {
            const isOnline = this.onlineUser.indexOf(data.friend_id) > -1;
            this.server.to(friend_id).emit('message', { send_id: id, recv_id: friend_id, message, isOnline, sendUserInfo, type }); // 给当前聊天室推送消息
        }
    }

    /**
     * 订阅指令 withdraw(消息撤回) 的消息
     * @param client
     * @param data { message_id, user_id, friend_id }
     */
    @SubscribeMessage('withdraw')
    async handleWithDraw(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<void> {
        const { friend_id } = data;
        const result = await this.eventService.handleWithDrawEvent(data, client['user']['nickname']);
        if(result) {
            this.server.to(friend_id).emit('withdraw', data); // 给当前聊天室推送消息
        }
    }

    /**
     * 订阅好友申请消息
     */
    @SubscribeMessage('addfriend')
    async handleAddFrien(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<void> {
        const { friend_id, remark } = data;
        const response = await this.eventService.addFiendVerify(data, client['user'].id);
        if(response) {
            this.server.to(friend_id).emit('addfriend', { remark, userInfo: response});
        }
    }

    /**
     * 订阅处理好友申请消息
     * 1、更新好友申请状态
     * 2、如果是动作是通过 => 自动发送一条打招呼消息
     */
    @SubscribeMessage('handlefriend')
    async handleFrienVerify(@ConnectedSocket() client: Socket, @MessageBody() data: HandleFriendDto): Promise<void> {
        const result = await this.eventService.handleFriend(data, client['user'].id);
        if(result) {
            const { friend_id, option } = data;
            if(option === 1) this.server.to(String(friend_id)).emit('handlefriend', { 
                friend_id, option, sessionList: await this.eventService.getSessionList(friend_id)
            });
            this.server.to(String(client['user'].id)).emit('handlefriend', { 
                friend_id, option, sessionList: await this.eventService.getSessionList(client['user'].id)
            });
        }
    }

    /**
     * 心跳包
     */
    @SubscribeMessage('ping')
    async handlePingEvent(@ConnectedSocket() client: Socket): Promise<any> {
        const { id } = client['user'];
        this.server.to(id).emit('ping', { message: 'pong' });
    }

    /**
     * 客户端连接断开时触发
     * @param data
     * @description 客户端退出，将此用户id从在线用户中移除
     */
    async handleDisconnect(@ConnectedSocket() client: Socket): Promise<any> {
        try {
            const user: User = <User> jwt.verify(client.handshake.query.token, jwtConstants.secret);
            const index = this.onlineUser.indexOf(user.id);
            if(index >= 0) {
                this.onlineUser = [
                    ...this.onlineUser.slice(0, index), ...this.onlineUser.slice(index + 1)
                ];
                // 给当前退出用户的在线好友广播消息，用来更新好友在线状态
                // do something... do what ？
            }
        } catch (err) {
            console.log('token过期，无法正常解析！')
        } 
    }
}
