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
    if(!date) return currendHourMin()
    const dateSplit = date.split(' ')
    const hourMinSec = dateSplit[1].substr(0, 5);
    const count = getIntervalDay(date);
    if(count === 0) {
        return hourMinSec; // 今天的时间
    } else if(count === 1) {
        return '昨天 ' + hourMinSec;
    } else {
        const monthDay = dateSplit[0].substr(5, 10);
        return monthDay + " " + hourMinSec;
    }
}

/**
 * 计算间隔天数
 * @param {*} data 2020-10-29
 */
export const getIntervalDay = data => {
    data = data.replace(/-/g, '')
    const date = data.toString();
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    const d1 = new Date(year + '/' + month + '/' + day);

    const dd = new Date();
    const y = dd.getFullYear();
    const m = dd.getMonth() + 1;
    const d = dd.getDate();

    const d2 = new Date(y + '/' + m + '/' + d);
    return parseInt(d2 - d1) / 1000 / 60 / 60 / 24;
}

// 获取当前时分
export const currendHourMin = () => {
    const nowDate = new Date().getTime();
    const offset_GMT = new Date().getTimezoneOffset();
    const today = new Date(nowDate + offset_GMT * 60 * 1000 + 8 * 60 * 60 * 1000);
    return twoDigits(today.getHours()) + ":" + twoDigits(today.getMinutes());
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