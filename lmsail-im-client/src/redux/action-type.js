/**
 * 包含n个 action type 名称常量
 */
export const INIT_CHAT_INFO    = 'init_chat_info'
export const INIT_MESS_LIST    = 'init_mess_list'
export const SEND_CHAT_MSG     = 'send_chat_msg'
export const RECEIVE_CHAT_MSG  = 'receive_chat_msg'
export const CHANGE_RIGHT_TYPE = 'change_right_type'
export const INIT_FRIEND_INFO  = 'init_friend_info'

export const AUTH_SUCCESS         = 'auth_success' // 登录成功的 type 类型
export const USERINFO             = 'user_info' // 获取用户信息成功
export const LOGOUT               = 'logout' // 用户退出登录
export const ERR_MSG              = 'err_msg' // 各种错误提示信息
export const USERSEARCH_LIST      = 'usersearch_list' // 添加好友 -> 检索结果
export const MODIFY_USER_CONTACTS = 'modify_user_contacts' // 修改消息会话列表
export const GET_NEW_FRIENDS      = 'get_new_friends' // 获取好友申请列表
export const GET_USER_MAILLIST    = 'get_user_mail_list' // 获取好友通讯录列表

export const SET_GLOBAL_SOCKET    = 'set_global_socket'  // 设置全局socket对象
export const SET_REDIRECT_PATH    = 'set_redirect_path'  // 设置重定向地址
export const SET_RESPONSE_MSG     = 'set_response_msg'   // 设置响应结果
export const UPDATE_UNREADNUM     = 'update_unreadnum'   // 消息未读数
export const APPEND_MESSLIST      = 'append_messlist'    // 追加消息
