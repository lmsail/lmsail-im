/**
 * 包含n个工具函数的模块
 */
import axios from 'axios'
import { serverUrl } from '../config/config'

/**
 * 获取缓存 / 设置缓存
 * @description 这里多次一举封装是因为便于后期使用其它缓存方式
 * @param {*} key 
 */
export const getItem = key => localStorage.getItem(key);
export const removeItem = key => localStorage.removeItem(key);
export const setItem = (key, data) => {
    typeof data === 'object' ? localStorage.setItem(key, JSON.stringify(data)) 
        : localStorage.setItem(key, data)
}

// 通讯录根据昵称拼音首字母排序并分组
export const pySegSort = list => {
    if (!String.prototype.localeCompare) return null
    let letters = 'abcdefghjklmnopqrstwxyz'.split('')
    let zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')
    let segs = []
    letters.forEach((item, i) => {
        let cur = {letter: item, data: []}
        list.forEach(item => {
            const nickname = item.nickname
            if (nickname.localeCompare(zh[i]) >= 0 && nickname.localeCompare(zh[i + 1]) < 0) {
                cur.data.push(item)
            }
        })
        if (cur.data.length) segs.push(cur)
    })
    return segs
}

/**
 * 网络请求
 * @param {*} url 
 * @param {*} data 
 * @param {*} type 
 */
export const Request = (url, data = {}, type = 'POST') => {
    url = `${serverUrl}${url}`
    if (type === 'GET') {
        let paramStr = ''
        Object.keys(data).forEach(key => paramStr += `${key}=${data[key]}&`)
        if (paramStr) {
            paramStr = paramStr.substring(0, paramStr.length - 1)
        }
        return axios.get(url + '?' + paramStr)
    } else {
        return axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${getItem('token')}`
            }
        })
    }
}

/**
 * 时间友好格式化
 * @param {*} date 
 */
export const friendTimeShow = date => {
    if(!date) return '刚刚'
    // date = new Date(new Date(new Date(date).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
    date = date.replace(/-/g, '/');
    date = new Date(date).getTime() / 1000;

    let time = new Date().getTime(), s;
    time = parseInt((time - date * 1000) / 1000);
    if (time < 60) {
        return '刚刚';
    } else if ((time < 60 * 60) && (time >= 60)) {
        s = Math.floor(time / 60);
        return s + "分钟前";
    } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
        s = Math.floor(time / 60 / 60);
        return s + "小时前";
    } else if ((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
        s = Math.floor(time / 60 / 60 / 24);
        return s + "天前";
    } else {
        date = new Date(parseInt(date) * 1000);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
}

// 获取当前时间
export const currentTime = () => {
    const timezone = 8;
    const offset_GMT = new Date().getTimezoneOffset();
    const nowDate = new Date().getTime();

    const today = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    const date = today.getFullYear() + "-" + twoDigits(today.getMonth() + 1) + "-" + twoDigits(today.getDate());
    const timeHour = twoDigits(today.getHours()) + ":" + twoDigits(today.getMinutes()) + ":" + twoDigits(today.getSeconds());
    return date + ' ' + timeHour;
}

// 数字不足10补0
const twoDigits = number => {
    if (number < 10) return '0' + number;
    return number;
}