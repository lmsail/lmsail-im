/**
 * 设置页面导航路由
 */
import User from '../pages/setting/user'
import MessageSetting from '../pages/setting/message'
import PageSetting from '../pages/setting/page'
import LoginSetting from '../pages/setting/login'
import About from '../pages/setting/about'

const SettingNavRouter = [
    {
        path: '/setting',
        components: User
    },
    {
        path: '/set-message',
        components: MessageSetting
    },
    {
        path: '/set-page',
        components: PageSetting
    },
    {
        path: '/set-login',
        components: LoginSetting
    },
    {
        path: '/set-about',
        components: About
    }
]

export default SettingNavRouter
