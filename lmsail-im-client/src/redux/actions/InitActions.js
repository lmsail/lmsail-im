/**
 * 存放init相关操作
 */
import PubSub from "pubsub-js";
import store from "../store";
import { pySegSort } from "../../utils";
import { getLastMessage, setContactLastMessage } from "./ContactActions";
import { userLoginInfo } from "./UserActions";
import { getMailList, recvNewFriend } from "./FriendActions";
import { USERSESSION_LIST } from "../types/ContactTypes";
import { CHANGE_RIGHT_TYPE, INIT_CHAT_INFO, INIT_MESS_LIST, SET_GLOBAL_SOCKET, UPDATE_UNREADNUM } from "../types/InitTypes";

export let socket = null

/* ------------ 同步 Actions ------------ */

// 初始化聊天数据
export const initChatData = chat => ({type: INIT_CHAT_INFO, data: chat})

// 切换右侧屈区域显示
export const showRightType = chat => ({type: CHANGE_RIGHT_TYPE, data: chat})

// 初始化历史消息
export const initHistoryMsg = chat => ({type: INIT_MESS_LIST, data: chat})

// 会话列表
export const userSessionList = data => ({type: USERSESSION_LIST, data})

// 更新未读消息数量
export const updateUnReadNum = data => ({ type: UPDATE_UNREADNUM, data })

// socket 相关 => 设置全局 socket 对象
export const setGlobalSocket = globalData => ({ type: SET_GLOBAL_SOCKET, data: globalData })


/* ------------ 异步 Actions ------------ */

// 设置全局socket连接对象
export const setSocketObject = socketObject => {
    return async dispatch => {
        socket = socketObject
        dispatch(setGlobalSocket(socketObject))
    }
}

/**
 * 界面信息初始化
 * { userInfo, sessionList, onlineFriend }
 * 当前用户信息 | 历史会话 | 在线的好友
 * @param {*} data
 */
export const initMain = data => {
    const { userInfo, sessionList, mailList, newFriendNum } = data
    return async dispatch => {
        await dispatch(userLoginInfo({userInfo, contacts: sessionList}))
        await dispatch(getMailList(pySegSort(mailList)))
        await dispatch(recvNewFriend({type: 'assign', number: newFriendNum}))
        await dispatch(initUnreadNum())
    }
}

// 初始化历史会话列表
export const initSessionList = sessionList => {
    return async dispatch => {
        await dispatch(userSessionList({ sessionList }))
        await dispatch(initUnreadNum())
    }
}

/**
 * 修改未读数红点
 * 1、消息未读数量
 * 2、好友提醒未读
 */
export const initUnreadNum = () => {
    return dispatch => {
        let msgUnreadNum = 0, newFriendNum = 0
        const { contacts } = (store.getState()).user
        contacts.map(item => msgUnreadNum += item.unread_num)
        dispatch(updateUnReadNum({ msgUnreadNum, newFriendNum }))
    }
}

/**
 * 初始化socket连接
 * @description 每次点开聊天窗口都会触发
 * @param {*} chatUserInfo
 * @param {*} needSend 是否需要发送socket初始化请求
 */
export const initChatInfo = (chatUserInfo, needSend = true) => {
    return async dispatch => {
        const { friend_id } = chatUserInfo
        if(needSend) socket.emit('join', { friend_id });
        await dispatch(initChatData({chatUserInfo, showRightType: 'message'}))
        await dispatch(initUnreadNum())
        if(!needSend) PubSub.publish('messFirstLoadDone')
    }
}

/**
 * 初始化消息列表
 * @description 这里是首次加载聊天时触发
 * @param {*} data
 */
export const initMessList = data => {
    return async dispatch => {
        const { list, friend_id } = data
        await dispatch(initHistoryMsg(data))
        dispatch(setContactLastMessage(friend_id, getLastMessage(list)))
        PubSub.publish('messFirstLoadDone')
    }
}

// 切换右侧显示状态
export const changeRightType = type => {
    return dispatch => {
        dispatch(showRightType({showRightType: type}))
    }
}
