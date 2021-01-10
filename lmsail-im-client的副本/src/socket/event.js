/**
 * socket 事件处理
 */
import { message as AM } from 'antd'
import store from '../redux/store'
import { setSocketObject, initMain, initMessList, recvChatMsg, withDrawMsgAction, addFriendCall, handleFriendVerify, logout } from '../redux/actions'

// 连接成功
export const connect = socket => {
    // 连接成功，将 socket 对象写入 store 状态中，便于全局使用
    store.dispatch(setSocketObject(socket))

    // 定时发送心跳包
    setInterval(() => socket.emit('ping', { message: 'pong' }), 30000)
}

// 初始化事件
export const init = message => {
    // console.log('收到 init 消息', message)
    store.dispatch(initMain(message.data))
}

/**
 * 进入聊天室事件
 * message: { user_id: 1, friend_id: 2, list: [] }
 * @param {*} message 
 */
export const join = message => {
    // console.log('系统消息 [join]', message)
    store.dispatch(initMessList(message))
}

/**
 * 监听消息事件
 * message：{send_id: 2, message: "撒打算打", isOnline: false}
 * send_id: 发送方id | message：发送内容 | isOnline: 是否在线（暂时没用）
 */
export const message = message => {
    // console.log('系统消息 [message]', message)
    store.dispatch(recvChatMsg(message))
}

/**
 * 撤回消息 - 无时间限制
 * @param {*} message { message_id, user_id, friend_id}
 */
export const withdraw = message => {
    // console.log('系统消息 [withdraw]', message)
    store.dispatch(withDrawMsgAction(message))
}

/**
 * 好友申请消息
 * @param {*} message 
 */
export const addFriend = message => {
    store.dispatch(addFriendCall(message))
}

/**
 * 好友验证处理后的回调
 * @param {*} message 
 */
export const handleFriend = message => {
    console.log('xx处理了您的好友请求', message)
    const { friend_id, option, sessionList } = message
    store.dispatch(handleFriendVerify(friend_id, option, sessionList, 'handle'))
}

// 授权验证失败事件
export const authError = () => {
    AM.error('登录信息已过期，请重新登录！')
    setTimeout(() => store.dispatch(logout()), 1000)
}

// 连接错误
export const connectError = message => {
    console.log('连接发生错误', message)
    // AM.error('已与服务器断开连接!!')
    // setTimeout(() => store.dispatch(logout()), 1000)
}

// 连接断开事件
export const disconnect = err => {
    // console.log('socket连接断开事件', err)
    AM.error('消息服务器连接断开，等待重连...')
    // setTimeout(() => store.dispatch(logout()), 1000)
}