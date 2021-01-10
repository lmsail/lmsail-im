import React, {Component} from 'react'
import {connect} from 'react-redux'
import PubSub from 'pubsub-js'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { Button, Col, Icon, Input, message as AM, Row, Tooltip } from 'antd'

import { modifyContacts, pushChatMsg, recvChatMsg } from '../../../redux/actions'
import FaceEmjoy from '../../../components/message/face'
import { createMsgID, currentTime, getItem } from '../../../utils'
import { serverUrl } from '../../../config/config'

class ChatTextarea extends Component {

    state = { message: '', showFace: false }

    componentDidMount(){
        document.onclick = () => this.setState({ showFace: false })
    }

    componentWillUnmount() {
        document.onclick = null // 在组件卸载时，取消事件监听
    }

    render() {
        const { showFace } = this.state
        return (
            <Dropzone accept="image/*" multiple={false} maxFiles={2} onDrop={(files) => this.sendPicMsg(this, files)}>
                {({getRootProps, getInputProps}) => (
                    <section {...getRootProps({ className: 'dropzone-section' })}>
                        <input {...getInputProps({disabled: true})} className="drop-input" />
                        <Row className="chat-tools">
                            <Col span={18}>
                                <Tooltip title="表情"><Icon type="smile" onClick={e => this.showFace(e)} /></Tooltip>
                                <Tooltip title="支持拖拽发送图片"><Icon type="picture" /></Tooltip>
                                <Tooltip title="发送代码片段"><Icon type="code" /></Tooltip>
                                <FaceEmjoy parent={ this } showFace={showFace} />
                            </Col>
                            <Col span={6} style={{ textAlign: "right" }}>
                                <Tooltip title="视频聊天"><Icon type="video-camera" style={{ marginRight: 10 }} /></Tooltip>
                                <Tooltip title="截图"><Icon type="scissor" /></Tooltip>
                            </Col>
                        </Row>
                        <Input.TextArea className="chat-textarea"
                            onChange={e => this.setMessageValue(e) }
                            onPressEnter={e => this.sendChatMess(e) }
                            placeholder="聊点什么呢..."
                            value={this.state.message}
                        />
                        <Button style={{ float: "right" }} onClick={ e => this.sendChatMess(e) }>发送</Button>
                    </section>
                )}
            </Dropzone>
        )
    }

    // 设置消息内容
    setMessageValue = e => {
        this.setState({ message: e.target.value })
    }

    // 显示表情
    showFace = e => {
        e.nativeEvent.stopImmediatePropagation()
        const { showFace } = this.state
        this.setState({ showFace: !showFace })
    }

    // 接收子组件传值
    getFaceItem = (object, faceEmjoy) => {
        let { message } = this.state
        message = message + faceEmjoy + " "
        this.setState({ message })
    }

    /**
     * 修改最后一条消息，并调整位置
     * @param contacts      会话列表
     * @param chatUserInfo  当前窗口好友信息
     * @param message       消息内容
     * @param type          类型
     */
    sortContacts = (contacts, chatUserInfo, message, type = 'text') => {
        const index = contacts.findIndex(user => user.friend_id === chatUserInfo.friend_id)
        if(index >= 0) {
            contacts[index].last_mess = type === 'text' ? message : '[图片]';
            contacts[index].unread_num = 0;
            contacts[index].created_at = currentTime()
            if(index > 0) {
                contacts.unshift(contacts.splice(index, 1)[0])
            }
            this.props.modifyContacts(contacts)
        }
    }

    /**
     * 对message基础过滤
     * TODO 适配消息类型 文字：text/图片：pic
     * @param e
     * @returns {string|null}
     */
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

    /**
     * 发送图片消息
     * @param e
     * @param files 数组-最大支持两张图片（非固定两张可自由调整 maxFiles 的值）
     */
    async sendPicMsg(e, files) {
        if(files.length <= 0) AM.error('只支持发送图片且同时最多可发送两张图片哦！')
        for (const file of files) {
            file.preview = URL.createObjectURL(file) // 本地预览图
            const response = (await this.upload(file)).data
            if(response.code === 400) return AM.error(response.message)
            this.sendChatMess(e, response.data, 'pic')
        }
    }

    /**
     * 上传图片 - 疑惑：为什么不能用封装后的请求而必须使用原使的 axios
     * @param file
     * @return Promise
     */
    async upload(file) {
        const param = new FormData()  // 创建form对象
        param.append('file', file)  // 通过append向form对象添加数据
        return await axios.post(`${serverUrl}/message/upload`, param, {
            headers: {
                "Authorization": `Bearer ${getItem('token')}`,
                "Content-Type": 'multipart/form-data'
            }
        })
    }

    /**
     * 发送消息
     * @param {*} e
     * @param {*} message 为空则取state中message值
     * @param {*} type    默认为text（文本类型）| pic（图片类型）
     */
    sendChatMess = (e, message = null, type = 'text') => {
        if (!e.keyCode || (e.keyCode === 13 && !e.shiftKey)) {
            message = message || this.filterMessage(e)
            if(!message) return AM.error('不能发空消息!')
            const { chat: { chatUserInfo }} = this.props
            let { user: { userInfo, contacts } } = this.props
            this.props.pushChatMsg({
                local_message_id: createMsgID(), // 生成本地消息id
                send_id: userInfo.id,
                recv_id: chatUserInfo.friend_id,
                message,
                type // 消息类型，默认为文本消息类型
            })
            PubSub.publish('messListAppend')
            this.sortContacts(contacts, chatUserInfo, message, type)
        }
    }
}

export default connect(
    state => ({ chat: state.chat, user: state.user }),
    { pushChatMsg, recvChatMsg, modifyContacts }
)(ChatTextarea)
