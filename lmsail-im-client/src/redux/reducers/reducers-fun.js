/**
 * reducers 涉及的方法实现
 */
import PubSub from 'pubsub-js'

// 初始化当前窗口的聊天记录
export const initMessList = (state, data) => {
    const { messList, messStatus } = state
    const { user_id, friend_id, list } = data
    const messKey = user_id > friend_id ? `${friend_id}${user_id}` : `${user_id}${friend_id}`
    messList[messKey] = list
    // 初始化当前聊天窗口数据状态
    const loadStatus = list && list.length >= 15
    messStatus[messKey] = messStatus[messKey] || { page: 0, showMoreText: loadStatus }
    return { ...state, loading: false, messList  }
}

// 处理聊天记录追加
export const handleMessAppend = (state, data) => {
    let { messList, messStatus } = state
    const { friend_id, user_id, list, page } = data
    const key = user_id > friend_id ? `${friend_id}${user_id}` : `${user_id}${friend_id}`;
    const time = list.length > 0 ? list[0]['created_at'] : null
    messList[key].unshift({ type: 'separate', page, time })
    list.map(item => messList[key].unshift(item))
    messStatus[key]['page'] = page
    PubSub.publish('messListUpdateCount', { count: list.length, key })
    return {...state, messList, messStatus}
}

// 隐藏指定窗口的加载更多文字状态
export const hideShowMoreText = (state, data) => {
    const { messStatus, messList } = state
    const { user_id, friend_id } = data
    const key = user_id > friend_id ? `${friend_id}${user_id}` : `${user_id}${friend_id}`;
    messStatus[key]['showMoreText'] = false
    messList[key].unshift({ type: 'messdone' }) // 追加一条消息加载到底提示
    return { ...state, messStatus }
}

// 处理聊天记录的loading状态
export const handleChatInfoLoading = (state, data) => {
    const { messList } = state
    const { chatUserInfo: {user_id, friend_id} } = data
    const key = user_id > friend_id ? `${friend_id}${user_id}` : `${user_id}${friend_id}`;
    const loading = !messList[key]
    return {...state, ...data, loading}
}

// 处理消息接收与发送
export const handleMessSendRecv = (state, data) => {
    const { messList } = state
    const { send_id, recv_id } = data
    const key = send_id > recv_id ? `${recv_id}${send_id}` : `${send_id}${recv_id}`;
    if(messList[key]) {
        messList[key] = [...messList[key], data];
    }
    return { ...state, messList }
}

// 消息撤回
export const withDrawMessageFun = (state, data) => {
    const { messList } = state
    const { user_id, friend_id, message_id, nickname } = data
    const key = user_id > friend_id ? `${friend_id}${user_id}` : `${user_id}${friend_id}`;
    if(messList[key]) {
        const index = messList[key].findIndex(item => {
            return item.id ? item.id === message_id : item.local_message_id === message_id;
        })
        messList[key][index]['message'] = `${nickname}撤回了一条消息`
        messList[key][index]['status'] = 0
        messList[key].push(messList[key].splice(index, 1)[0])
    }
    return { ...state, messList }
}
