import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Icon, Button, Input, Tooltip, message as AM } from 'antd'

import { pushChatMsg, recvChatMsg, modifyContacts } from '../../../redux/actions'
import FaceEmjoy from '../../../components/message/face'
import { currentTime } from '../../../utils'

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
                        <Tooltip title="发送表情">
                            <Icon type="smile" onClick={e => this.showFace(e)} />
                        </Tooltip>
                        <Tooltip title="发送图片"><Icon type="picture" /></Tooltip>
                        <Tooltip title="发送代码片段"><Icon type="code" /></Tooltip>
                        <Tooltip title="发送链接"><Icon type="link" /></Tooltip>
                        <FaceEmjoy parent={ this } showFace={showFace} />
                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <Tooltip title="视频聊天"><Icon type="video-camera" style={{ marginRight: 10 }} /></Tooltip>
                        <Tooltip title="截图"><Icon type="scissor" /></Tooltip>
                    </Col>
                </Row>
                <Input.TextArea className="chat-textarea"
                       onChange={e => this.handleTextArea('message', e) } placeholder="说点什么吧..."
                       onPressEnter={e => this.sendChatMess(e) }
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
        let { message } = this.state
        message += faceEmjoy + " "
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

    sendChatMess = e => {
        e.preventDefault();
        const { message } = this.state
        if(!message) return AM.error('不能发空消息!')
        this.setState({ message: '' })
        // 追加消息记录并发送 socket 消息
        const { chat: { chatUserInfo }} = this.props
        let { user: { userInfo, contacts } } = this.props
        this.props.pushChatMsg({
            send_id: userInfo.id,
            recv_id: chatUserInfo.friend_id,
            message
        })
        this.sortContacts(contacts, chatUserInfo, message)
    }
}

export default connect(
    state => ({ chat: state.chat, user: state.user }),
    { pushChatMsg, recvChatMsg, modifyContacts }
)(ChatTextarea)
