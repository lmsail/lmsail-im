/**
 * redux最核心的管理对象模块
 * redux-thunk 异步支持
 * redux-devtools-extension 浏览器调试插件
 * 最终向外暴露 store 对象（即 reducers 中定义的对象）
 */
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { combineReducers } from 'redux'

import { user } from './reducers/UserReducers'
import { chat } from './reducers/ChatReducers'
import { friend } from './reducers/FriendReducers'
import { globalData, globalResponse } from './reducers/GlobalReducers'

const reducers = combineReducers({
    user, chat, friend, globalData, globalResponse
})

// 向外暴露 store 对象
export default createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk))
)
