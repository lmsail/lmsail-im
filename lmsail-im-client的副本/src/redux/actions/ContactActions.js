import { reqDelContactItem } from "../../api";
import { message as AM } from "antd";
import { initUnreadNum } from "./InitActions";
import store from "../store";
import { MODIFY_USER_CONTACTS } from "../types/ContactTypes";

/* ------------ 同步 Actions ------------ */

// 更新用户会话列表
export const modifyUserContacts = user => ({type: MODIFY_USER_CONTACTS, data: user})

// 修改消息会话列表
export const modifyContacts = contacts => {
    return dispatch => {
        dispatch(modifyUserContacts({ contacts }))
    }
}


/* ------------ 异步 Actions ------------ */

// 移除指定的会话窗口
export const removeContactItem = (friend_id, contacts) => {
    return async dispatch => {
        const response = (await reqDelContactItem(friend_id)).data
        if(response.code === 200) {
            dispatch(modifyContacts(contacts))
            dispatch(initUnreadNum())
        } else {
            AM.error(response.message)
        }
    }
}

// 获取聊天数据的最后一条消息
export const getLastMessage = list => {
    if(list.length === 0) return null
    const lastItem = list[list.length - 1]
    return lastItem.status === 0 ? '[消息撤回]' : lastItem.message
}

// 获取当前窗口最后一条聊天数据并修改会话窗口
export const setContactLastMessage = (friend_id, last_message) => {
    return dispatch => {
        const { contacts } = (store.getState()).user
        if(contacts) {
            const index = contacts.findIndex(item => item.friend_id === friend_id)
            const message = contacts[index]['last_mess']
            contacts[index]['last_mess'] = message === 'loading...' ? last_message : message
            dispatch(modifyContacts(contacts))
        }
    }
}
