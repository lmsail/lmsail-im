/**
 * 对应 reducers 中的 action 同步/异步请求
 */
import { message as AM, notification } from 'antd'
import PubSub from 'pubsub-js'
import {
    initChatData, receiveChatMsg, sendChatMsg, showRightType, showFriendInfo, authSuccess, userLoginInfo,
    logOut, modifyUserContacts, getNewFriends, getMailList, setGlobalSocket, searchUserList, setRdirectPath, setResponseMsg, 
    initHistoryMsg, updateUnReadNum, appendMesslist, hiddenMoreText, withDrawMessage, recvNewFriend, userSessionList
} from './init'
import { 
    reqFriendVerify, reqLogin, reqLogout, reqFriendList, reqFriendRemark, reqUpdateUinfo, reqUserInfo, 
    reqUserSearch, reqRegister, reqUpdatePassword, reqHistoryMessage 
} from '../api'
import store from './store'
import { pySegSort, setItem, removeItem, currentTime } from '../utils'

let socket = null

// 用户登录
export const login = (username, password) => {
    return async dispatch => {
        const response = (await reqLogin({username, password})).data
        if (response.code === 200) {
            AM.success(response.message)
            setItem('token', response.data.token)
            dispatch(authSuccess(response.data))
        } else {
            AM.error(response.message)
        }
    }
}

// 用户注册
export const register = (username, nickname, password) => {
    return async dispatch => {
        const response = (await reqRegister(username, nickname, password)).data
        if(response.code === 200) {
            AM.success(response.message)
            setTimeout(() => dispatch(setRdirectPath('/login')), 1000)
        } else {
            AM.error(response.message)
        }
    }
}

// 退出登录
export const logout = () => {
    return async dispatch => {
        removeItem('token'); dispatch(logOut())
        await reqLogout();
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

// 修改消息会话列表
export const modifyContacts = contacts => {
    return dispatch => {
        dispatch(modifyUserContacts({ contacts }))
    }
}

/**
 * 初始化socket连接
 * @description 每次点开聊天窗口都会触发
 * @param {*} chatUserInfo 
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
        await dispatch(initHistoryMsg(data))
        PubSub.publish('messFirstLoadDone')
    }
}

// 切换右侧显示状态
export const changeRightType = type => {
    return dispatch => {
        dispatch(showRightType({showRightType: type}))
    }
}

// 发送消息
export const pushChatMsg = chat => {
    return async dispatch => {
        const { recv_id, message } = chat
        socket.emit('message', { friend_id: recv_id, message })
        await dispatch(sendChatMsg(chat))
        dispatch(initUnreadNum())
    }
}

// 收到好友消息
export const recvChatMsg = chat => {
    return async dispatch => {
        await dispatch(receiveChatMsg(chat))
        dispatch(initUnreadNum())
        PubSub.publish('playMessageSound') // 发送消息提醒事件
    }
}

// 设置好友基本信息
export const setFriendInfo = friendInfo => {
    return async dispatch => {
        await dispatch(changeRightType('userInfo'))
        await dispatch(showFriendInfo(friendInfo))
    }
}

// 获取用户通讯录列表 
export const getFriendList = () => {
    return async dispatch => {
        const response = (await reqFriendList()).data
        if(response.code === 200) {
            dispatch(getMailList(pySegSort(response.data)))
        } else {
            AM.error(response.message)
        }
    }
}

// 获取好友申请列表
export const getNewFriendList = () => {
    return async dispatch => {
        const response = (await reqFriendVerify()).data
        if(response.code === 200) {
            dispatch(getNewFriends(response.data))
        } else {
            AM.error(response.message)
        }
    }
}

// 好友验证请求
export const handleFriendVerify = (friend_id, option, sessionList, type = 'send') => {
    return async dispatch => {
        if(type === 'send') {
            return socket.emit('handlefriend', { friend_id, option })
        }
        let { newFriend } = (store.getState()).friend
        newFriend.map(item => {
            if(item.user_id === friend_id) item.status = option
            return item
        })
        if(option === 1) dispatch(getFriendList()) // 通过后重新获取通讯录列表
        dispatch(getNewFriends(newFriend)) // 获取好友申请列表
        dispatch(recvNewFriend({type: 'reduce', number: 0})) // 好友申请数量自减1
        await dispatch(initSessionList(sessionList))
    }
}

// 更改好友备注
export const modifyFriendNickRemark = (friend_id, remark, info) => {
    return async dispatch => {
        const response = (await reqFriendRemark({ friend_id, remark })).data
        if(response.code === 200) {
            info.nick_remark = remark
            dispatch(getFriendList())
            dispatch(showFriendInfo(info))
        } else {
            AM.error(response.message)
        }
    }
}

// 获取指定用户信息
export const getUserInfo = () => {
    return async dispatch => {
        const response = (await reqUserInfo()).data
        if(response.code === 200) {
            dispatch(userLoginInfo({userInfo: response.data}))
        } else {
            AM.error(response.message)
        }
    }
}

// 修改用户信息
export const modifyUserInfo = (fieldName, fieldValue) => {
    return async dispatch => {
        const response = (await reqUpdateUinfo({ fieldName, fieldValue })).data
        if(response.code === 200) {
            let { userInfo } = (store.getState()).user
            userInfo[fieldName] = fieldValue
            dispatch(userLoginInfo({ userInfo }))
        } else {
            AM.error(response.message)
        }
    }
}

// 修改密码
export const modifyPassword = (password, new_password) => {
    return async dispatch => {
        const response = (await reqUpdatePassword({ password, new_password })).data
        const { code, message } = response
        dispatch(setResponseMsg( code, 'userInfo', message))
        dispatch(setResponseMsg( code, null, null))
        if(code === 200) {
            setTimeout(() => dispatch(logout()), 1000)
        }
    }
}

// 同步用户头像
export const syncUserAvatar = avatar => {
    return async dispatch => {
        let { userInfo } = (await store.getState()).user
        userInfo['avatar'] = avatar
        dispatch(userLoginInfo({ userInfo }))
    }
}

// 模糊搜索用户
export const findUserList = (keyword, callback) => {
    return async dispatch => {
        const response = (await reqUserSearch(keyword)).data
        if(response.code === 200) {
            dispatch(searchUserList(response.data))
        } else {
            AM.error(response.message)
        }
        callback()
    }
}

// 添加好友
export const addFriend = (friend_id, remark) => {
    return dispatch => {
        socket.emit('addfriend', {friend_id, remark});
        AM.success('好友申请已发送')
    }
}

/**
 * 添加好友回执，执行消息提醒等
 * @param {*} data 返回的是发送申请的用户信息 
 */
export const addFriendCall = data => {
    return async dispatch => {
        const { remark, userInfo } = data
        notification.open({
            message: `来自[${userInfo.nickname}]的好友申请`, description: remark || `你好，我是${userInfo.nickname}`
        });
        await dispatch(recvNewFriend({type: 'inc', number: 0}))
    }
}

// 加载更多消息
export const findMoreMessage = (friend_id, user_id, page = 0) => {
    return async dispatch => {
        const response = (await reqHistoryMessage({friend_id, page})).data
        const { code, data } = response
        if(code === 200 && data.length > 0) {
            await dispatch(appendMesslist({friend_id, user_id, list: data, page}))
            if(data.length < 15) await dispatch(hiddenMoreText({friend_id, user_id, data, page}))
        } else {
            // 消息加载结束，将当前用户窗口的 showMoreText 设置为 false
            await dispatch(hiddenMoreText({friend_id, user_id, data, page}))
        }
        PubSub.publish('messLoadDone')
    }
}

// 发送消息撤回指令 data: {user_id, friend_id, message_id}
// 适用于撤回发起人
export const withDrawMsgIns = data => {
    return async dispatch => {
        const { user_id, friend_id } = data
        socket.emit('withdraw', data)
        await dispatch(withDrawMessage(data))
        await dispatch(receiveChatMsg({
            send_id: friend_id, recv_id: user_id, sendUserInfo: {
                user_id, friend_id,
                last_mess: '[消息撤回]', unread_num: 0, created_at: currentTime()
            }
        }))
    }
}

// 消息撤回动作 data: {user_id, friend_id, message_id}
// 适用于撤回消息接收人
export const withDrawMsgAction = data => {
    return async dispatch => {
        const { user_id, friend_id } = data
        dispatch(withDrawMessage(data))
        await dispatch(receiveChatMsg({
            send_id: user_id, recv_id: friend_id, sendUserInfo: {
                user_id, friend_id,
                last_mess: '[消息撤回]', created_at: currentTime()
            }
        }))
    }
}

export const setSocketObject = socketObject => {
    return async dispatch => {
        socket = socketObject
        dispatch(setGlobalSocket(socketObject))
    }
}