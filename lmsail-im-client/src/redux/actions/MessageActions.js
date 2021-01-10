import PubSub from "pubsub-js";
import { initUnreadNum, socket } from "../actions/InitActions";
import { reqHistoryMessage } from "../../api";
import { currentTime } from "../../utils";
import { APPEND_MESSLIST, HIDDEN_MORETEXT, RECEIVE_CHAT_MSG, SEND_CHAT_MSG, WITHDRAW_MESSAGE } from "../types/MessageTypes";

/* ------------ 同步 Actions ------------ */

// 追加消息
export const appendMesslist = data => ({ type: APPEND_MESSLIST, data })

// 隐藏更多消息的文字
export const hiddenMoreText = data => ({ type: HIDDEN_MORETEXT, data })

// 收到消息
export const receiveChatMsg = chat => ({type: RECEIVE_CHAT_MSG, data: chat})

// 发送消息
export const sendChatMsg = chat => ({type: SEND_CHAT_MSG, data: chat})

// 撤回消息
export const withDrawMessage = data => ({type: WITHDRAW_MESSAGE, data})


/* ------------ 异步 Actions ------------ */

// 发送消息
export const pushChatMsg = chat => {
    return async dispatch => {
        const { recv_id, message, local_message_id, type } = chat
        socket.emit('message', { friend_id: recv_id, message, local_message_id, type })
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
