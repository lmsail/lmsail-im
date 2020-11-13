import React, { Component } from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import { Row, Col, Icon, Button, Input, Tooltip, message as AM } from 'antd'

import { pushChatMsg, recvChatMsg, modifyContacts } from '../../../redux/actions'
import FaceEmjoy from '../../../components/message/face'
import { currentTime, createMsgID } from '../../../utils'

class ChatTextarea extends Component {

    state = { message: '', showFace: false }

    componentDidMount(){
        document.onclick = () => this.setState({ showFace: false })
    }

    componentWillUnmount() {
        document.onclick = null // 在组件卸载时，取消事件监听，防止内存泄漏
    }

    handleTextArea = (name, e) => {
        this.setState({ [name]: e.target.value })
    }

    render() {
        const { showFace } = this.state
        return (
            <section style={{ position: "relative" }}>
                <Row className="chat-tools">
                    <Col span={18}>
                        <Tooltip title="emjoy表情"><Icon type="smile" onClick={e => this.showFace(e)} /></Tooltip>
                        <Tooltip title="发送图片"><Icon type="picture" /></Tooltip>
                        <Tooltip title="发送代码片段"><Icon type="code" /></Tooltip>
                        <FaceEmjoy parent={ this } showFace={showFace} />
                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <Tooltip title="视频聊天"><Icon type="video-camera" style={{ marginRight: 10 }} /></Tooltip>
                        <Tooltip title="截图"><Icon type="scissor" /></Tooltip>
                    </Col>
                </Row>
                <Input.TextArea className="chat-textarea"
                       onChange={e => this.handleTextArea('message', e) } placeholder="聊点什么呢..."
                       onPressEnter={e => this.sendChatMess(e) }
                       //onKeyDown={e => this.testonkeydown(e)}
                       value={this.state.message}
                />
                <Button style={{ float: "right" }} onClick={ e => this.sendChatMess(e) }>发送</Button>
            </section>
        )
    }

    showFace = e => {
        e.nativeEvent.stopImmediatePropagation()
        const {showFace} = this.state
        this.setState({ showFace: !showFace })
    }

    // 接收子组件传值
    getFaceItem = (object, faceEmjoy) => {
        const message = this.state.message + faceEmjoy + " "
        this.setState({ message })
    }

    // 修改最后一条消息，并调整位置
    sortContacts = (contacts, chatUserInfo, message) => {
        const index = contacts.findIndex(user => user.friend_id === chatUserInfo.friend_id)
        if(index >= 0) {
            contacts[index].last_mess = message;
            contacts[index].unread_num = 0;
            contacts[index].created_at = currentTime()
            if(index > 0) {
                contacts.unshift(contacts.splice(index, 1)[0])
            }
            this.props.modifyContacts(contacts)
        }
    }

    // 对message基础过滤
    // TODO 适配消息类型 文字：text/图片：pic/代码：code
    filterMessage = e => {
        e.preventDefault();
        let { message } = this.state
        if(!message || (message.replace(/(\n)/g, '')).length === 0) {
            this.setState({ message: '' })
            return null
        }
        message = message.replace(/<[^>]+>/g, '') // 删除所有html标签
        if(message.length <= 0) message = '[不支持的消息内容]'
        if(message.length > 500) message += '\n\n❌ [消息内容过长，发送失败] ❌'
        this.setState({ message: '' })
        return message
    }

    // 发送消息
    // TODO 增加消息类型
    sendChatMess = e => {
        if (!e.keyCode || (e.keyCode === 13 && !e.shiftKey)) {
            const message = this.filterMessage(e)
            if(!message) return AM.error('不能发空消息!')
            const { chat: { chatUserInfo }} = this.props
            let { user: { userInfo, contacts } } = this.props
            this.props.pushChatMsg({
                local_message_id: createMsgID(), // 生成本地消息id
                send_id: userInfo.id,
                recv_id: chatUserInfo.friend_id,
                message
            })
            PubSub.publish('messListAppend')
            this.sortContacts(contacts, chatUserInfo, message)
        }
    }
}

export default connect(
    state => ({ chat: state.chat, user: state.user }),
    { pushChatMsg, recvChatMsg, modifyContacts }
)(ChatTextarea)
