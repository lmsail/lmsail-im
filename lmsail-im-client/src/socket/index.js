/**
 * socketIO 实现与服务端交互
 */
import io from 'socket.io-client'
import { getItem } from '../utils'
import * as Event from './event'
import { socketUrl } from '../config/config'

export const MessServerConnect = () => {
    
    const socket = io.connect(socketUrl, {
        query: `token=${getItem('token')}`,
        reconnection: true
    }); 
    
    socket.on('connect', () => Event.connect(socket)); // 连接事件
    
    socket.on('init', message => Event.init(message)); // 监听初始化事件
    
    socket.on('join', message => Event.join(message)); // 监听 join 事件
    
    socket.on('message', message => Event.message(message)); // 监听 message 事件

    socket.on('withdraw', message => Event.withdraw(message)); // 监听消息撤回事件

    socket.on('addfriend', message => Event.addFriend(message)); // 监听添加好友消息

    socket.on('handlefriend', message => Event.handleFriend(message)); // 监听吹好友验证的回调
    
    socket.on('authError', () => Event.authError()); // 连接错误时返回
    
    socket.on('ping', message => null); // 心跳包

    socket.on('connect_error', message => Event.connectError(message)); // 连接错误
    
    socket.on('disconnect', err => Event.disconnect(err)); // 连接断开
}
