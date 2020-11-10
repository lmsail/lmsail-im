import { combineReducers } from 'redux'
import * as types from './action-type'
import * as funs from './reducers-fun'
import { initUser, initChatInfo, friendInfo, initGlobalData, responseMsg } from './init'

// 全局对象
const globalData = (state = initGlobalData, action) => {
    switch (action.type) {
        case types.SET_GLOBAL_SOCKET: // 设置全局socket对象
            return { socket: action.data } 
        default:
            return state
    }
}

/**
 * 设置全局响应提示，目前只有 common/user-info/index.jsx中使用了这种提示方式
 * 这种方式虽然实现起来比较繁琐，但是可以提高耦合性，后面根据实际情况再做调整
 * 目前 redux 交互的代码有点杂乱无章，v2版本时考虑重写，毕竟这还是年初边学边做时的产物～～
 * @description 2020-10-26 15:20 新增
 * @param {*} state 
 * @param {*} action 
 */
const globalResponse = (state = responseMsg, action) => {
    switch (action.type) {
        case types.SET_RESPONSE_MSG:
            const { type, page, message } = action.data
            return { ...state, type, page, message } 
        default:
            return state
    }
}

// 当前登录的用户信息
const user = (state = initUser, action) => {
    switch (action.type) {
        case types.AUTH_SUCCESS:
            return {...action.data, ...state, msg: null, redirectTo: '/'}
        case types.USERINFO:
            const { userInfo, contacts } = action.data
            return contacts ? {...state, userInfo, contacts} : {...state, userInfo}
        case types.USERSESSION_LIST: // 会话列表
            const { sessionList } = action.data
            return {...state, contacts: sessionList}
        case types.LOGOUT:
            return {...action.data, redirectTo: '/login'}
        case types.ERR_MSG:
            return {...state, msg: action.data, redirectTo: '/login'}
        case types.SET_REDIRECT_PATH:
            return { redirectTo: `${action.data}` }
        case types.USERSEARCH_LIST:
            return {...state, searchList: action.data}
        case types.MODIFY_USER_CONTACTS:
            return {...state, contacts: action.data.contacts}

        case types.UPDATE_UNREADNUM: // 消息未读数
            const { msgUnreadNum } = action.data
            return { ...state, unread: msgUnreadNum }

        case types.RECEIVE_CHAT_MSG: // 收到消息时
            // 更新 contacts 数据
            let { sendUserInfo, send_id } = action.data
            const contact = state.contacts
            const index = contact.findIndex(user => user.friend_id === send_id)
            if(index < 0) {
                // 直接追加的话，user_id 与 friend_id 是颠倒的
                const { user_id, friend_id } = sendUserInfo;
                sendUserInfo['user_id'] = friend_id; sendUserInfo['friend_id'] = user_id;
                contact.unshift(sendUserInfo)
            } else { // 改变位置
                contact[index]['last_mess'] = sendUserInfo.last_mess
                contact[index]['created_at'] = sendUserInfo.created_at
                contact[index]['unread_num'] = sendUserInfo.unread_num ?? contact[index]['unread_num']+1
                contact.unshift(contact.splice(index, 1)[0])
            }
            return { ...state, contacts: contact }
        default:
            return state
    }
}

// 好友的用户基本信息
const friend = (state = friendInfo, action) => {
    switch (action.type) {
        case types.INIT_FRIEND_INFO:
            return {...state, info: action.data}
        case types.GET_NEW_FRIENDS:
            return {...state, newFriend: action.data}
        case types.GET_USER_MAILLIST:
            return {...state, mailList: action.data}
        case types.SETNEWFRIEND_NUM: // 好友申请数自增1/自减1
            const { type } = action.data
            const newFriendNum = type === 'inc' ? state.newFriendNum + 1 : (
                state.newFriendNum > 0 ? state.newFriendNum - 1 : 0
            )
            return {...state, newFriendNum}
        default:
            return state
    }
}

// 当前查看的消息列表
const chat = (state = initChatInfo, action) => {
    
    switch (action.type) {
        case types.INIT_CHAT_INFO:
            return funs.handleChatInfoLoading(state, action.data)

        case types.INIT_MESS_LIST: // 初始化消息列表
            return funs.initMessList(state, action.data)

        case types.SEND_CHAT_MSG:    /* 发送消息 */
        case types.RECEIVE_CHAT_MSG: /* 接收消息 */
            return funs.handleMessSendRecv(state, action.data)

        case types.APPEND_MESSLIST: // 追加消息并更新当前窗口的状态
            return funs.handleMessAppend(state, action.data)

        case types.HIDDEN_MORETEXT: // 隐藏窗口中加载更多文字
            return funs.hideShowMoreText(state, action.data)

        case types.WITHDRAW_MESSAGE: // 消息撤回
            return funs.withDrawMessageFun(state, action.data)

        case types.CHANGE_RIGHT_TYPE:
            return {...state, ...action.data}
        default:
            return state
    }
}

export default combineReducers({
    user, chat, friend, globalData, globalResponse
})