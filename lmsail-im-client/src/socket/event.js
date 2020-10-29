/**
 * socket 事件处理
 * -----------------------------------------------
 * 外部组件使用 redux 时，选择哪种方式？
 * 
 * import { setGlobalSocket } from '../redux/init'
 * 
 * 1、所有方法写到 redux 相关文件中
 *  eg：store.dispatch(setGlobalSocket(socket))
 * 
 * 2、直接使用 state 对象更改 redux 中的值
 *  const statr = store.getState();
 *  eg：state.globalData.socket = socket;
 * 
 * 第一种方式会触发页面重新渲染，第二种不会
 * -----------------------------------------------
 */
import store from '../redux/store'
import { setSocketObject, initMain, initMessList, recvChatMsg, logout } from '../redux/actions'
import { message as AM } from 'antd'

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
    AM.error('消息服务器未开启，即将退出!!')
    setTimeout(() => store.dispatch(logout()), 1000)
}