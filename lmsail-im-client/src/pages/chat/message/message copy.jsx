import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar, Row, Col, Skeleton, Icon } from 'antd'
import PubSub from 'pubsub-js'
import { friendTimeShow } from '../../../utils'
import { findMoreMessage } from '../../../redux/actions'

class Message extends Component {

    state = { loadmore: false, page: 0, showMoreText: false }

    componentDidUpdate() {
        if(this.state.page <= 0)
            this.scrollToBottom()
    }

    componentDidMount() {
        this.scrollToBottom()

        // 监听加载历史消息事件
        PubSub.subscribe('messageLoadMore', (msg, data) => {
            this.setState({ loadmore: false, showMoreText: data && data.length >= 15 })
        });

        // 初始化state
        /**
         * @params data 
         */
        PubSub.subscribe('initMessageState', (msg, data) => {
            //this.setState({ loadmore: false, page: 0 })
        });

        // 监听发送消息
        PubSub.subscribe('sendMessage', () => {
            if(this.state.page > 0) this.scrollToBottom()
        });
    }

    render() {
        const { chat: { loading } } = this.props
        return (
            <div>
                <Skeleton loading={loading} avatar={{shape: "square"}} active paragraph={{rows: 6}}>
                    {this.getLoadMoreDom()}
                    {this.getMessList()}
                </Skeleton>
                <div ref={el => this.messagesEnd = el}/>
            </div>
        )
    }

    // 加载更多消息
    getMoreMessage = () => {
        let { page } = this.state
        page++
        const { chat: { chatUserInfo: { friend_id } }, user: { userInfo: { id } } } = this.props
        this.setState({ loadmore: true, page })
        this.props.findMoreMessage(friend_id, id, page)
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: 'auto'});
    }

    // 获取加载更多的文字提示
    getLoadMoreDom = () => {
        const { loadmore, showMoreText } = this.state
        if(!showMoreText) return null
        return loadmore ? (
            <div className="message-more">
                以上是历史消息，<span><Icon type="loading" spin /></span>
            </div>
        ) : <div className="message-more">
                以上是历史消息，<span onClick={this.getMoreMessage}>点击加载更多</span>
            </div>
    }

    // 获取消息列表的 dom 结构
    getMessList = () => {
        const { chat: { chatUserInfo, messList }, user: { userInfo } } = this.props
        const { friend_id } = chatUserInfo; const { id } = userInfo;
        const key = id > friend_id ? `${friend_id}${id}` : `${id}${friend_id}`;
        if(!messList[key]) return null
        return messList[key].map((item, index) => {
            if(item.type && item.type === 'separate') { // 分隔符
                return <div key={index} className="separate">
                    <span>{item.time ? `上一次聊天 ${friendTimeShow(item.time)} - 第 ${item.page} 页` : `以上是第 ${item.page} 页的记录`}</span>
                </div>
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
                                    <span>{item.message} <sub>{ friendTimeShow(item.created_at) }</sub></span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            } else {
                return <div key={index}>
                    <div className="message-item message-right">
                        <div className="pull-left message">
                            <span>{item.message} <sub>{ friendTimeShow(item.created_at) }</sub></span>
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
}

export default connect(
    state => ({chat: state.chat, user: state.user}), 
    { findMoreMessage }
)(Message)
