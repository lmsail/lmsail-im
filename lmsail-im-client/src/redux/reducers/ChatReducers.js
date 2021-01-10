// 当前查看的消息列表
import * as funs from "./reducers-fun";
import { INIT_CHAT_INFO, INIT_MESS_LIST, CHANGE_RIGHT_TYPE } from "../types/InitTypes";
import { SEND_CHAT_MSG, RECEIVE_CHAT_MSG, APPEND_MESSLIST, HIDDEN_MORETEXT, WITHDRAW_MESSAGE } from "../types/MessageTypes";

// 存储聊天信息等
const initChatInfo = {
    loading: true,
    messList: {}, // 存放用户聊天记录，键名规则：user_id,friend_id从小到大组合，如：1，2，则键名=12
    messStatus: {}, // 存放聊天界面的状态（page，showMoreText）
    chatUserInfo: {},
    showRightType: 'welcome', /* 右侧显示内容 */
}

export const chat = (state = initChatInfo, action) => {
    switch (action.type) {
        case INIT_CHAT_INFO:
            return funs.handleChatInfoLoading(state, action.data)

        case INIT_MESS_LIST: // 初始化消息列表
            return funs.initMessList(state, action.data)

        case SEND_CHAT_MSG:    /* 发送消息 */
        case RECEIVE_CHAT_MSG: /* 接收消息 */
            return funs.handleMessSendRecv(state, action.data)

        case APPEND_MESSLIST: // 追加消息并更新当前窗口的状态
            return funs.handleMessAppend(state, action.data)

        case HIDDEN_MORETEXT: // 隐藏窗口中加载更多文字
            return funs.hideShowMoreText(state, action.data)

        case WITHDRAW_MESSAGE: // 消息撤回
            return funs.withDrawMessageFun(state, action.data)

        case CHANGE_RIGHT_TYPE:
            return {...state, ...action.data}
        default:
            return state
    }
}
