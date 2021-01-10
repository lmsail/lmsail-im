import { INIT_FRIEND_INFO, GET_NEW_FRIENDS, GET_USER_MAILLIST, SETNEWFRIEND_NUM } from "../types/FriendTypes";

// 存储当前点击的用户信息
const friendInfo = {
    newFriend: [],   // 好友请求列表
    mailList: [],    // 通讯录列表
    info: {},        // 当前进入好友详情
    newFriendNum: 0, // 新的好友请求
}

export const friend = (state = friendInfo, action) => {
    switch (action.type) {
        case INIT_FRIEND_INFO:
            return {...state, info: action.data}
        case GET_NEW_FRIENDS:
            return {...state, newFriend: action.data}
        case GET_USER_MAILLIST:
            return {...state, mailList: action.data}
        case SETNEWFRIEND_NUM: // 好友申请数自增1/自减1/=x
            const { type, number } = action.data
            const option = {
                'inc': state.newFriendNum + 1,
                'reduce': state.newFriendNum > 0 ? state.newFriendNum - 1 : 0,
                'assign': number
            };
            return {...state, newFriendNum: option[type]}
        default:
            return state
    }
}
