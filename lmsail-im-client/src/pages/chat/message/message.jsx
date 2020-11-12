import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar, Row, Col, Skeleton, Icon, Dropdown, Menu, message as AM } from 'antd'
import PubSub from 'pubsub-js'
import { friendTimeShow, handleMessage } from '../../../utils'
import { findMoreMessage, withDrawMsgIns } from '../../../redux/actions'

class Message extends Component {

    state = { loadmore: false, message_id: 0 }

    componentDidMount() {
        this.scrollToBottom()

        // 消息首次加载完成
        PubSub.subscribe('messFirstLoadDone', () => this.scrollToBottom())

        // 消息加载结束
        PubSub.subscribe('messLoadDone', () => this.setState({ loadmore: false }))

        // 监听消息追加/提醒（接收到消息，主动发送消息）
        PubSub.subscribe('messListAppend', () => this.scrollToBottom())
        PubSub.subscribe('playMessageSound', () => this.scrollToBottom())
    }   

    render() {
        const { chat: { chatUserInfo: { friend_id }, loading }, user: { userInfo: { id } } } = this.props
        const key = id > friend_id ? `${friend_id}${id}` : `${id}${friend_id}`;
        return (
            <div>
                <Skeleton loading={loading} avatar={{shape: 'square'}} active paragraph={{rows: 6}}>
                    {this.getLoadMoreDom(key)}
                    {this.getMessList(key)}
                </Skeleton>
                <div ref={el => this.messagesEnd = el} />
            </div>
        )
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

    scrollToBottom = () => {
        if(this.messagesEnd)
            this.messagesEnd.scrollIntoView();
    }

    // 获取加载更多的文字提示
    getLoadMoreDom = key => {
        const { chat: { messStatus } } = this.props 
        if(messStatus && messStatus[key]) {
            const { showMoreText } = messStatus[key]
            if(!showMoreText) return null
            return this.state.loadmore ? (
                <div className="message-more">
                    以上是历史消息，<span><Icon type="loading" spin /></span>
                </div>
            ) : <div className="message-more">
                    以上是历史消息，<span onClick={e => this.getMoreMessage(key)}>点击加载更多</span>
                </div>
        }
    }

    // 获取消息列表的 dom 结构
    getMessList = key => {
        const { chat: { chatUserInfo, messList }, user: { userInfo } } = this.props
        const { friend_id } = chatUserInfo
        if(!messList[key]) return null
        return messList[key].map((item, index) => {
            if(item.type && item.type === 'separate') { // 翻页分隔符
                return <div key={index} className="separate">
                    <span>{item.time ? `时光倒流至 ${friendTimeShow(item.time)} - 第 ${item.page} 页` : `以上是第 ${item.page} 页的记录`}</span>
                </div>
            }
            if(item.type && item.type === 'messdone') { // 加载到底分隔符
                return <div key={index} className="separate"><span>美好的回忆总是短暂的，尽情享受当下吧～</span></div>
            }
            if(item.status === 0) {
                return <div key={index} className="message-time"><span>{item.message}</span></div>
            }
            if(!item.message) return null
            if (item.send_id === friend_id) {
                return <div key={index}>
                    <div className="message-item message-left">
                        <Row>
                            <Col span={1} style={{ minWidth: "48px" }}>
                                <Avatar shape="square" size={35} src={item.avatar || chatUserInfo.avatar}/>
                            </Col> 
                            <Col span={20}>
                                <div className="message">
                                    <span><i dangerouslySetInnerHTML={handleMessage(item.message)} /> <sub>{ friendTimeShow(item.created_at) }</sub></span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            } else {
                return <div key={index}>
                    <div className="message-item message-right">
                        <div className="pull-left message">
                            {this.createRightMessDom(item)}
                        </div>
                        <div className="pull-right">
                            <Avatar shape="square" size={35} src={item.avatar || userInfo.avatar}/>
                        </div>
                        <div style={{clear: "both"}}/>
                    </div>
                </div>
            }
        })
    }

    // 生成右键撤回消息节点
    createRightMessDom = item => {
        const menu = (
            <Menu>
                <Menu.Item onClick={() => this.withdraw()}><Icon type="delete" /> 撤回</Menu.Item>
            </Menu>
        );
        return (
            <Dropdown trigger={['contextMenu']} overlay={menu} onVisibleChange={() => this.setMessageId(item.id || item.local_message_id)}>
                <span><i dangerouslySetInnerHTML={handleMessage(item.message)} /> <sub>{ friendTimeShow(item.created_at) }</sub></span>
            </Dropdown>
        )
    }

    // 设置当前选中的消息id
    setMessageId = message_id => {
        if(message_id && this.state.message_id !== message_id) {
            this.setState({ message_id })
        }
    }

    // 消息撤回 - 有待改进
    // 缺陷 xxx撤回了一条消息，xxx显示的用户原昵称，而非备注
    // TODO 重大BUG，在本地发送消息后缺失消息id，所以撤回是message_id是空
    withdraw = () => {
        const { message_id } = this.state
        if(!message_id) return AM.error('获取消息id失败，这里待修复！！')
        const { chat: { chatUserInfo: { friend_id } }, user: { userInfo: { id, nickname } } } = this.props
        this.props.withDrawMsgIns({ message_id, friend_id, user_id: id, nickname})
    }
}

export default connect(
    state => ({chat: state.chat, user: state.user}), 
    { findMoreMessage, withDrawMsgIns }
)(Message)
