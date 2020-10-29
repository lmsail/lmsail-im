import {
    CHANGE_RIGHT_TYPE, INIT_CHAT_INFO, INIT_FRIEND_INFO, RECEIVE_CHAT_MSG, SEND_CHAT_MSG,
    AUTH_SUCCESS, ERR_MSG, USERINFO, LOGOUT, MODIFY_USER_CONTACTS, GET_NEW_FRIENDS,
    GET_USER_MAILLIST, SET_GLOBAL_SOCKET, USERSEARCH_LIST, SET_REDIRECT_PATH, SET_RESPONSE_MSG,
    INIT_MESS_LIST, UPDATE_UNREADNUM, APPEND_MESSLIST
} from "./action-type";

// 全局对象
export const initGlobalData = {
    socket: null
}

// 设置提示信息 - 用于请求后对响应结果的提示
export const responseMsg = {
    type: 200, // 对应的响应类型 200 | !200
    page: null, // 对应的页面或接口
    message: null // 提示信息
}

// 存储当前登录用户信息
export const initUser = {
    userInfo: {},   // 存放用户信息
    msg: '',        // 登录验证消息
    redirectTo: '', // 重定向地址 
    contacts: [],   // 历史会话列表
    searchList: [], // 搜索到的用户列表
    unread: 0       // 消息未读数
}

// 存储聊天信息等
export const initChatInfo = {
    loading: true,
    messList: {}, // 存放用户聊天记录
    chatUserInfo: {},
    showRightType: 'welcome', /* 右侧显示内容 */
}

// 存储当前点击的用户信息
export const friendInfo = {
    newFriend: [],
    mailList: [],
    info: {},
    newFriendNum: 0
}

// 同步 Action
export const initChatData = chat => ({type: INIT_CHAT_INFO, data: chat})
export const sendChatMsg = chat => ({type: SEND_CHAT_MSG, data: chat})
export const receiveChatMsg = chat => ({type: RECEIVE_CHAT_MSG, data: chat})
export const showRightType = chat => ({type: CHANGE_RIGHT_TYPE, data: chat})
export const initHistoryMsg = chat => ({type: INIT_MESS_LIST, data: chat})
export const showFriendInfo = friend => ({type: INIT_FRIEND_INFO, data: friend})
export const appendMesslist = data => ({ type: APPEND_MESSLIST, data })

// 用户相关
export const authSuccess = user => ({type: AUTH_SUCCESS, data: user})
export const userLoginInfo = user => ({type: USERINFO, data: user})
export const logOut = () => ({ type: LOGOUT, data: {} })
export const errMsg = msg => ({ type: ERR_MSG, data: msg })
export const searchUserList = user => ({ type: USERSEARCH_LIST, data: user })
export const updateUnReadNum = data => ({ type: UPDATE_UNREADNUM, data })

// 更新用户会话列表
export const modifyUserContacts = user => ({type: MODIFY_USER_CONTACTS, data: user})
// 获取好友申请列表
export const getNewFriends = list => ({type: GET_NEW_FRIENDS, data: list})
// 获取好友通讯录列表
export const getMailList = list => ({type: GET_USER_MAILLIST, data: list})

// socket 相关 => 设置全局 socket 对象
export const setGlobalSocket = globalData => ({ type: SET_GLOBAL_SOCKET, data: globalData })

// 设置跳转地址
export const setRdirectPath = path => ({ type: SET_REDIRECT_PATH, data: path })

// 设置全局响应提示
export const setResponseMsg = (type, page, message) => ({ type: SET_RESPONSE_MSG, data: {type, page, message} })