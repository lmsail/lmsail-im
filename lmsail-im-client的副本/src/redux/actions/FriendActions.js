/**
 * 存放好友相关操作
 */
import {message as AM, notification} from "antd";
import { reqFriendList, reqFriendRemark, reqFriendVerify } from "../../api";
import { pySegSort } from "../../utils";
import store from "../store";
import { changeRightType, initSessionList, socket } from "./InitActions";
import { GET_NEW_FRIENDS, GET_USER_MAILLIST, INIT_FRIEND_INFO, SETNEWFRIEND_NUM } from "../types/FriendTypes";

/* ------------ 同步 Actions ------------ */

// 获取好友通讯录列表
export const getMailList = list => ({type: GET_USER_MAILLIST, data: list})

// 获取好友申请列表
export const getNewFriends = list => ({type: GET_NEW_FRIENDS, data: list})

// 收到好友申请
export const recvNewFriend = data => ({type: SETNEWFRIEND_NUM, data})

// 查看好友信息
export const showFriendInfo = friend => ({type: INIT_FRIEND_INFO, data: friend})


/* ------------ 异步 Actions ------------ */

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
            message: `✉️ 来自[${userInfo.nickname}]的好友申请`, description: remark || `你好，我是${userInfo.nickname}`
        });
        await dispatch(recvNewFriend({type: 'inc', number: 0}))
    }
}
