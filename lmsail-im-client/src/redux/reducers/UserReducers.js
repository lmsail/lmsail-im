import { AUTH_SUCCESS, USERINFO, LOGOUT, SET_REDIRECT_PATH, USERSEARCH_LIST } from "../types/UserTypes";
import { ERR_MSG, UPDATE_UNREADNUM } from "../types/InitTypes";
import { MODIFY_USER_CONTACTS, USERSESSION_LIST } from "../types/ContactTypes";
import { RECEIVE_CHAT_MSG } from "../types/MessageTypes";

// 存储当前登录用户信息
const initUser = {
    userInfo: {},   // 存放用户信息
    msg: '',        // 登录验证消息
    redirectTo: '', // 重定向地址
    contacts: [],   // 历史会话列表
    searchList: [], // 搜索到的用户列表
    unread: 0       // 消息未读数
}

export const user = (state = initUser, action) => {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {...action.data, ...state, msg: null, redirectTo: '/'}
        case USERINFO:
            const { userInfo, contacts } = action.data
            return contacts ? {...state, userInfo, contacts} : {...state, userInfo}
        case USERSESSION_LIST: // 会话列表
            const { sessionList } = action.data
            return {...state, contacts: sessionList}
        case LOGOUT:
            return {...action.data, redirectTo: '/login'}
        case ERR_MSG:
            return {...state, msg: action.data, redirectTo: '/login'}
        case SET_REDIRECT_PATH:
            return { redirectTo: `${action.data}` }
        case USERSEARCH_LIST:
            return {...state, searchList: action.data}
        case MODIFY_USER_CONTACTS:
            return {...state, contacts: action.data.contacts}

        case UPDATE_UNREADNUM: // 消息未读数
            const { msgUnreadNum } = action.data
            return { ...state, unread: msgUnreadNum }

        case RECEIVE_CHAT_MSG: // 收到消息时
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
                contact[index]['unread_num'] = sendUserInfo.unread_num ?? contact[index]['unread_num'] + 1
                contact.unshift(contact.splice(index, 1)[0])
            }
            return { ...state, contacts: contact }
        default:
            return state
    }
}
