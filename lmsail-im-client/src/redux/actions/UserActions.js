// 存放用户相关的方法

import { reqLogin, reqLogout, reqRegister, reqUpdatePassword, reqUpdateUinfo, reqUserInfo, reqUserSearch } from "../../api";
import { removeItem, setItem } from "../../utils";
import { message as AM, notification } from "antd";
import store from "../store";
import {AUTH_SUCCESS, LOGOUT, SET_REDIRECT_PATH, SET_RESPONSE_MSG, USERINFO, USERSEARCH_LIST} from "../types/UserTypes";

/* ------------ 同步 Actions ------------ */

// 登录认证成功
export const authSuccess = user => ({type: AUTH_SUCCESS, data: user})

// 退出
export const logOut = () => ({ type: LOGOUT, data: {} })

// 当前登录用户信息
export const userLoginInfo = user => ({type: USERINFO, data: user})

// 搜索的用户列表
export const searchUserList = user => ({ type: USERSEARCH_LIST, data: user })

// 设置跳转地址
export const setRdirectPath = path => ({ type: SET_REDIRECT_PATH, data: path })

// 设置全局响应提示
export const setResponseMsg = (type, page, message) => ({ type: SET_RESPONSE_MSG, data: {type, page, message} })


/* ------------ 异步 Actions ------------ */

// 用户登录
export const login = (username, password, callBack) => {
    return async dispatch => {
        const response = (await reqLogin({username, password})).data
        if (response.code === 200) {
            setItem('token', response.data.token)
            dispatch(authSuccess(response.data))
            notification.open({
                message: `🎉 欢迎登录小站，喜欢可以点个小星星✨`, description: `可在 ‘添加好友’ 页面，搜索 ‘M先生’（作者）添加好友哦！`
            });
        } else {
            AM.error(response.message)
            callBack()
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
export const findUserList = (keyword, callback) => {
    return async dispatch => {
        const response = (await reqUserSearch(keyword)).data
        if(response.code === 200) {
            dispatch(searchUserList(response.data))
        } else {
            AM.error(response.message)
        }
        callback()
    }
}
