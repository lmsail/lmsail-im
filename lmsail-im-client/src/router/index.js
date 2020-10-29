/**
 * 路由组件
 */
import ChatContainer from '../pages/chat'
import Setting from '../pages/setting'
import MailList from '../pages/maillist'
import Welcome from '../components/welcome'
import ChatMessage from '../pages/chat/message'
import Login from '../pages/login/login'
import Register from '../pages/login/register'

const Routers = [
    {
        path: '/',
        components: ChatContainer
    },
    {
        path: '/welcome',
        components: Welcome
    },
    {
        path: '/message',
        components: ChatMessage
    },
    {
        path: '/friend',
        components: MailList
    },
    {
        path: '/setting',
        components: Setting
    },
    {
        path: '/set-message',
        components: Setting
    },
    {
        path: '/set-page',
        components: Setting
    },
    {
        path: '/set-login',
        components: Setting
    },
    {
        path: '/set-about',
        components: Setting
    },
    {
        path: '/login',
        components: Login
    },
    {
        path: '/register',
        components: Register
    }
]

export default Routers
