import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar, Row, Col, Skeleton, Icon, Dropdown, Menu } from 'antd'
import PubSub from 'pubsub-js'
import { friendTimeShow, handleMessage } from '../../../utils'
import { findMoreMessage, withDrawMsgAction } from '../../../redux/actions'

class Message extends Component {

    state = { loadmore: false, message_id: 0 }

    componentDidMount() {
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
        this.messagesEnd.scrollIntoView({behavior: 'auto'});
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
                const menu = (
                    <Menu>
                        <Menu.Item onClick={() => this.withdraw()}><Icon type="delete" /> 撤回</Menu.Item>
                    </Menu>
                );
                return <div key={index}>
                    <div className="message-item message-right">
                        <div className="pull-left message">
                            <Dropdown trigger={['contextMenu']} overlay={menu} onVisibleChange={() => this.setMessageId(item.id)}>
                                <span>
                                    <i dangerouslySetInnerHTML={handleMessage(item.message)} /> <sub>{ friendTimeShow(item.created_at) }</sub>
                                    {/* <Icon type="down" className="option" /> 鼠标移动会出现一个小图标，原本是用来显示更多操作的 */}
                                </span>
                            </Dropdown>
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

    // 设置当前选中的消息id
    setMessageId = message_id => {
        if(this.state.message_id !== message_id) {
            this.setState({ message_id })
        }
    }

    // 消息撤回
    withdraw = () => {
        const { message_id } = this.state
        const { chat: { chatUserInfo: { friend_id } }, user: { userInfo: { id } } } = this.props
        this.props.withDrawMsgAction({ message_id, friend_id, user_id: id})
    }
}

export default connect(
    state => ({chat: state.chat, user: state.user}), 
    { findMoreMessage, withDrawMsgAction }
)(Message)
