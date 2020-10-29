/**
 * 对应 reducers 中的 action 同步/异步请求
 */
import { message as AM } from 'antd'
import PubSub from 'pubsub-js'
import {
    initChatData, receiveChatMsg, sendChatMsg, showRightType, showFriendInfo, authSuccess, userLoginInfo,
    logOut, modifyUserContacts, getNewFriends, getMailList, setGlobalSocket, searchUserList, setRdirectPath, setResponseMsg, 
    initHistoryMsg, updateUnReadNum, appendMesslist
} from './init'
import { 
    reqFriendVerify, reqFriendHandle, reqLogin, reqLogout, reqFriendList, reqFriendRemark, reqUpdateUinfo, reqUserInfo, 
    reqUserSearch, reqFriendAdd, reqRegister, reqUpdatePassword, reqHistoryMessage 
} from '../api'
import store from './store'
import { pySegSort, setItem, removeItem } from '../utils'

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
    const { userInfo, sessionList, mailList } = data
    return async dispatch => {
        dispatch(userLoginInfo({userInfo, contacts: sessionList}))
        dispatch(getMailList(pySegSort(mailList)))
        dispatch(initUnreadNum())
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
        dispatch(modifyUserContacts({contacts}))
    }
}

/**
 * 初始化socket连接
 * @param {*} chatUserInfo 
 */
export const initChatInfo = (chatUserInfo, needSend = true) => {
    return async dispatch => {
        const { friend_id } = chatUserInfo
        if(needSend) socket.emit('join', { friend_id });
        await dispatch(initChatData({chatUserInfo, loading: false, showRightType: 'message'}))
        dispatch(initUnreadNum())
    }
}

/**
 * 初始化消息列表
 * @param {*} data
 */
export const initMessList = data => {
    return async dispatch => {
        await dispatch(initHistoryMsg(data))
        PubSub.publish('messageLoadMore', data.list)
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

// 处理好友申请
export const handleFriendVerify = (friend_id, option) => {
    return async dispatch => {
        const response = (await reqFriendHandle({ friend_id, option })).data
        if(response.code === 200) {
            let { newFriend } = (store.getState()).friend
            newFriend.map(item => {
                if(item.user_id === friend_id) item.status = option
                return item
            })
            dispatch(getNewFriends(newFriend))
            dispatch(getFriendList())
        } else {
            AM.error(response.message)
        }
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
export const findUserList = keyword => {
    return async dispatch => {
        const response = (await reqUserSearch(keyword)).data
        if(response.code === 200) {
            dispatch(searchUserList(response.data))
        } else {
            AM.error(response.message)
        }
    }
}

// 添加好友
export const addFriend = (friend_id, remark) => {
    return async dispatch => {
        const response = (await reqFriendAdd({ friend_id, remark })).data
        AM.error(response.message)
    }
}

// 加载更多消息
export const findMoreMessage = (friend_id, uid, page = 0) => {
    return async dispatch => {
        const response = (await reqHistoryMessage({friend_id, page})).data
        const { code, data } = response
        if(code === 200 && data.length > 0) {
            dispatch(appendMesslist({friend_id, uid, data, page}))
        }
        PubSub.publish('messageLoadMore', data)
    }
}

export const setSocketObject = socketObject => {
    return async dispatch => {
        socket = socketObject
        dispatch(setGlobalSocket(socketObject))
    }
}