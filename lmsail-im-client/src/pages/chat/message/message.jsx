import React, { Component } from 'react'
import { connect } from 'react-redux'
import copy from 'copy-to-clipboard'
import PubSub from 'pubsub-js'
import LazyLoad from 'react-lazyload'
import { Element, scroller } from 'react-scroll'
import { Avatar, Row, Col, Skeleton, Icon, Dropdown, Menu, Modal, message as AM } from 'antd'
import { friendTimeShow, handleMessage } from '../../../utils'
import { findMoreMessage, withDrawMsgIns } from '../../../redux/actions'
import GroupDetails from '../../../components/group/details'
import DefaultIcon from '../../../assets/images/icon/default.png'

let prevTime = null; // 存放上一次的消息时间节点
let messKey = 0;     // 当前窗口的消息key

class Message extends Component {

    state = { loadmore: false, message_id: 0, message: null, visible: false, previewImage: null }

    componentDidMount() {
        setTimeout(() => this.scrollToBottom(), 0)

        // 消息首次加载完成
        PubSub.subscribe('messFirstLoadDone', ()  => this.scrollToBottom())

        // 消息加载结束
        PubSub.subscribe('messLoadDone', () => this.setState({ loadmore: false }))

        // 监听消息追加/提醒（接收到消息，主动发送消息）
        PubSub.subscribe('messListAppend', () => this.scrollToBottom())
        PubSub.subscribe('playMessageSound', () => this.scrollToBottom())
        PubSub.subscribe('messListUpdateCount', (_, res) => this.scrollTo(`mess${res.count - 1}`))
    }

    componentDidUpdate() {
        const { chat: { chatUserInfo: { friend_id } }, user: { userInfo: { id } } } = this.props
        messKey = id > friend_id ? `${friend_id}${id}` : `${id}${friend_id}`
    }

    render() {
        const { visible, previewImage } = this.state
        const { chat: { loading } } = this.props
        return (
            <div className="h100">
                <Element id="containerElement" className="h100 containerElement">
                    <Skeleton loading={loading} avatar={{shape: 'square'}} active paragraph={{rows: 6}}>
                        {this.createLoadMoreDom(messKey)}
                        {this.createMessList(messKey)}
                    </Skeleton>
                </Element>
                <Modal visible={visible} footer={null} onCancel={ () => this.setState({ visible: false }) }>
                    <img alt="" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <GroupDetails />
            </div>
        )
    }

    // 消息撤回
    withdraw = () => {
        const { message_id } = this.state
        if(!message_id) return AM.error('获取消息id失败，这里待修复！！')
        const { chat: { chatUserInfo: { friend_id } }, user: { userInfo: { id, nickname } } } = this.props
        this.props.withDrawMsgIns({ message_id, friend_id, user_id: id, nickname})
    }

    // 加载更多消息
    getMoreMessage = key => {
        const { chat: { messStatus } } = this.props
        let { page } = messStatus[key]
        page++
        const { chat: { chatUserInfo: { friend_id } }, user: { userInfo: { id } } } = this.props
        this.setState({ loadmore: true })
        this.props.findMoreMessage(friend_id, id, page)
    }

    // 获取加载更多的文字提示
    createLoadMoreDom = key => {
        const { chat: { messStatus } } = this.props
        if(messStatus && messStatus[key]) {
            const { showMoreText } = messStatus[key]
            if(!showMoreText) return null
            return this.state.loadmore ? (
                <div className="message-more">以上是历史消息，<span><Icon type="loading" spin /></span></div>
            ) : (
                <div className="message-more">以上是历史消息，<span onClick={() => this.getMoreMessage(key)}>点击加载更多</span></div>
            )
        }
    }

    // 获取消息列表的 dom 结构
    createMessList = key => {
        const { chat: { chatUserInfo, messList }, user: { userInfo } } = this.props
        const { friend_id } = chatUserInfo
        if(!messList[key]) return null

        return messList[key].map((item, index) => {
            const header = this.createMessHeader(item, index)
            if (header) return header
            const msgTimeDom = this.createMessTimeDom(item.created_at, index)
            if (item.send_id === friend_id) {
                return this.createSelfMessageNode(item, index, msgTimeDom, chatUserInfo)
            } else {
                return this.createFriendMessageNode(item, index, msgTimeDom, userInfo)
            }
        })
    }

    // 生成提示类型的消息
    createMessHeader = (item, index) => {
        if(item.type && item.type === 'separate') { // 翻页分隔符
            return <div key={index} className="separate">
                <span>{item.time ? `时光倒流至 ${friendTimeShow(item.time)} - 第 ${item.page} 页` : `以上是第 ${item.page} 页的记录`}</span>
            </div>
        }
        if(item.type && item.type === 'messdone') { // 加载到底分隔符
            return <div key={index} className="separate"><span>美好的回忆总是短暂的，尽情享受当下吧～</span></div>
        }
        if(item.status === 0) { // 撤回消息类型
            return <div key={index} className="message-withdraw"><span>{item.message}</span></div>
        }
        if(!item.message) return null
    }

    // 生成时间节点
    createMessTimeDom = (createdTime, index) => {
        const endTime = createdTime ? new Date(Date.parse(createdTime.replace(/-/g, "/"))) : new Date();
        // 第一条消息默认追加时间节点
        if(index === 0) {
            prevTime = endTime;
            return <div key={index} className="message-time"><span>{friendTimeShow(createdTime)}</span></div>
        }
        // 70秒外的记录增加时间节点
        let messageDom = ""
        const diffTime = Math.floor((endTime > prevTime ? endTime - prevTime : prevTime - endTime) / 1000); // 相差的秒
        if(diffTime > 70) {
            prevTime = endTime;
            messageDom = <div key={index} className="message-time"><span>{friendTimeShow(createdTime)}</span></div>
        }
        return messageDom
    }

    // 生成自己发送的消息节点
    createSelfMessageNode = (item, index, msgTimeDom, userInfo) => {
        return <Element key={index} name={`mess` + index}>
            {msgTimeDom}
            <div className="message-item message-left">
                <Row>
                    <Col span={1} style={{ minWidth: "48px" }}>
                        <Avatar shape="square" size={35} src={item.avatar || userInfo.avatar}/>
                    </Col>
                    <Col span={20}>
                        <div className="message">{this.createDropMessDom(item, 'target')}</div>
                    </Col>
                </Row>
            </div>
        </Element>
    }

    // 生成好友发送的消息节点
    createFriendMessageNode = (item, index, msgTimeDom, chatUserInfo) => {
        return <Element key={index} name={`mess` + index}>
            {msgTimeDom}
            <div className="message-item message-right">
                <div className="pull-left message"> {this.createDropMessDom(item)} </div>
                <div className="pull-right">
                    <Avatar shape="square" size={35} src={item.avatar || chatUserInfo.avatar}/>
                </div>
                <div style={{clear: "both"}}/>
            </div>
        </Element>
    }

    // 生成右键撤回消息节点
    // type:self(自己的消息)|target(好友的消息)
    createDropMessDom = (item, type = 'self') => {
        const menu = type === 'self' ? (
            <Menu>
                <Menu.Item onClick={() => this.withdraw()}><Icon type="delete" /> 撤回</Menu.Item>
                <Menu.Item onClick={() => this.copyMessage()}><Icon type="copy" /> 复制</Menu.Item>
            </Menu>
        ) : <Menu><Menu.Item onClick={() => this.copyMessage()}><Icon type="copy" /> 复制</Menu.Item></Menu>
        return (
            <Dropdown trigger={['contextMenu']} overlay={menu} onVisibleChange={() => this.setMessageInfo(item.id || item.local_message_id, item.message)}>
                {this.createMessContentDom(item)}
            </Dropdown>
        )
    }

    // 生成消息内容节点
    createMessContentDom = item => {
        item.type = item.type || 'text'
        return item.type === 'text' ? (
            <span><i dangerouslySetInnerHTML={handleMessage(item.message)} /></span>
        ) : (
            <span className="normal">
                <LazyLoad key={item} height={200} overflow={true} once placeholder={<img width="100%" height="100%" src={DefaultIcon} alt="logo"/>}>
                    <img src={item.message} width="100%" onClick={() => this.picPreview(item.message)} alt="" />
                </LazyLoad>
            </span>
        )
    }

    // 设置当前选中的消息id与消息内容
    setMessageInfo = (message_id, message) => {
        const selectText = document.getSelection().toString();
        if(message_id && this.state.message_id !== message_id) {
            this.setState({ message_id, message: selectText || message })
        } else {
            this.setState({ message: selectText || message })
        }
    }

    // 复制消息
    copyMessage = () => {
        copy(this.state.message)
    }

    // 查看图片大图
    picPreview = picPath => {
        this.setState({ visible: true, previewImage: picPath })
    }

    // 滚动到底部
    scrollToBottom = () => {
        const { chat: { messList } } = this.props
        if(messKey && messList && messList[messKey]) 
            this.scrollTo(`mess${messList[messKey].length - 1}`)
    }

    // 滚动到指定 dom 位置
    scrollTo = element => {
        scroller.scrollTo(element, {
            duration: 0,
            smooth: 'easeInOutQuart',
            containerId: 'containerElement'
        })
    }
}

export default connect(
    state => ({chat: state.chat, user: state.user}),
    { findMoreMessage, withDrawMsgIns }
)(Message)
