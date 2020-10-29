/**
 * 包含了n个接口请求的函数的模块
 */

import { Request } from '../utils'

/* ------------ 登录、注册、退出 ------------ */

// 登录接口
export const reqLogin = ({username, password}) => Request('/auth/login', { username, password })

// 注册接口
export const reqRegister = (username, nickname, password) => Request('/auth/register', { username, nickname, password })

// 退出接口
export const reqLogout = () => Request('/auth/logout', {})


/* ------------ 用户模块 ------------ */

// 获取用户信息
export const reqUserInfo = id => Request('/user', { id })

// 更新用户信息
export const reqUpdateUinfo = ({fieldName, fieldValue}) => Request('/user/info', {fieldName, fieldValue})

// 更新用户密码
export const reqUpdatePassword = ({ password, new_password }) => Request('/user/password', { password, new_password })

// 更新用户头像
export const reqUpdateAvatar = file => Request('/user/avatar', { file })

// 搜索用户列表
export const reqUserSearch = keyword => Request('/user/search', { keyword })


/* ------------ 好友模块 ------------ */

// 获取通讯录列表
export const reqFriendList = () => Request('/friend', {})

// 获取好友申请列表
export const reqFriendVerify = () => Request('/friend/verify', {})

// 添加好友
export const reqFriendAdd = ({ friend_id, remark }) => Request('/friend/add', { friend_id, remark })

// 处理好友请求
export const reqFriendHandle = ({ friend_id, option }) => Request('/friend/handle', { friend_id, option })

// 更改好友备注
export const reqFriendRemark = ({ friend_id, remark }) => Request('/friend/remark', { friend_id, remark })

/* ------------ 聊天消息模块 ------------ */
export const reqHistoryMessage = ({friend_id, page = 0}) => Request('/message/list', {friend_id, page})