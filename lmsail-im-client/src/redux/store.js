/**
 * redux最核心的管理对象模块
 * redux-thunk 异步支持
 * redux-devtools-extension 浏览器调试插件
 * 最终向外暴露 store 对象（即 reducers 中定义的对象）
 */
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import reducers from './reducers'

// 向外暴露 store 对象
export default createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk))
)