// 全局对象
import { SET_GLOBAL_SOCKET, SET_RESPONSE_MSG } from "../types/InitTypes";

// 全局对象
const initGlobalData = {
    socket: null
}

// 设置提示信息 - 用于请求后对响应结果的提示
const responseMsg = {
    type: 200, // 对应的响应类型 200 | !200
    page: null, // 对应的页面或接口
    message: null // 提示信息
}

export const globalData = (state = initGlobalData, action) => {
    switch (action.type) {
        case SET_GLOBAL_SOCKET: // 设置全局socket对象
            return { socket: action.data }
        default:
            return state
    }
}

/**
 * 设置全局响应提示，目前只有 common/user-info/index.jsx中使用了这种提示方式
 * 这种方式虽然实现起来比较繁琐，但是可以提高耦合性，后面根据实际情况再做调整
 * 目前 redux 交互的代码有点杂乱无章，v2版本时考虑重写，毕竟这还是年初边学边做时的产物～～
 * @description 2020-10-26 15:20 新增
 * @param {*} state
 * @param {*} action
 */
export const globalResponse = (state = responseMsg, action) => {
    switch (action.type) {
        case SET_RESPONSE_MSG:
            const { type, page, message } = action.data
            return { ...state, type, page, message }
        default:
            return state
    }
}
