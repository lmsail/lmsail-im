import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Avatar, Button, Row, Col, message as AM, Modal, Form, Input, Icon } from 'antd'

import { initChatInfo, modifyContacts, modifyFriendNickRemark } from '../../../redux/actions'
import { currentTime } from '../../../utils'

class Profile extends Component {

    state = { visible: false, nickRemark: null, confirmLoading: false }

    render() {
        const {friend: {info}} = this.props
        if (!info) return null
        return <div className="m-user-info">
            <div className="user-info-main">
                <div className="basic-info border-b">
                    <div className="left">
                        <Avatar size={60} shape="square" src={info.avatar}/>
                    </div>
                    <div className="right">
                        <div className="user-name">{info.nick_remark || info.nickname}</div>
                        <div className="user-desc">昵称：{info.nickname || info.nick_remark}</div>
                    </div>
                    <div className="clearfix" />
                </div>
                {this.getItemList()}
                <div className="btn-operation">
                    <Button type="primary" block={true} onClick={this.openMessage}>发送消息</Button>
                    {/* <Button type="danger" block={true} onClick={this.removeFriend}>移除好友</Button> */}
                </div>
            </div>
            {this.nickModalDom()}
        </div>
    }

    openMessage = () => {
        let {friend: {info}, user: {contacts}} = this.props
        if(contacts) {
            if(contacts.findIndex(user => user.friend_id === info.friend_id) < 0) {
                info.created_at = currentTime();  info.last_mess = 'loading...'; contacts.unshift(info)
                this.props.modifyContacts(contacts)
            }
        }
        this.props.initChatInfo(info)
        this.props.history.push({pathname: '/'})
    }

    removeFriend = () => {
        AM.error('既然已经加了我，为什么还想着删除我，你是飘了吗？');
    }

    changeModalStatus = visible => {
        this.setState({ visible })
    }

    setNickRemark = e => {
        const nickRemark = e.target.value;
        this.setState({ nickRemark })
    }

    // 更新好友备注
    saveFriendNickName = () => {
        const {friend: { info }} = this.props
        const { nickRemark } = this.state
        if(!nickRemark) return AM.error('请输入备注/备注无更改')
        this.setState({ confirmLoading: true, visible: false })
        this.props.modifyFriendNickRemark(info.friend_id, nickRemark, info);
        setTimeout(() => this.setState({ confirmLoading: false }), 500)
    }

    getItemList = () => {
        const {friend: { info }} = this.props
        const itemList = [
            {itemName: "地区", itemValue: info.area || "保密"},
            {itemName: "备注", itemValue: info.nick_remark || '未设置', action: () => this.changeModalStatus(true)},
            {itemName: "昵称", itemValue: info.nickname},
            {itemName: "手机号", itemValue: info.mobile || '保密'},
            {itemName: "个性签名", itemValue: info.autograph || '暂无'},
        ]
        return itemList.map(item => (
            <Row className="user-item border-b" key={item.itemName}>
                <Col span={4}>{item.itemName}</Col>
                <Col span={20} onClick={item.action} style={{textAlign: "right", textIndent: 10}}>{item.itemValue}</Col>
            </Row>
        ))
    }

    nickModalDom = () => {
        const { visible, confirmLoading } = this.state
        const {friend: { info }} = this.props
        return <Modal title={`修改好友[${info.nickname}]备注`} visible={visible} 
            confirmLoading={confirmLoading}
            onCancel={() => this.changeModalStatus(false)}
            onOk={this.saveFriendNickName}
        >
            <Form>
                <Form.Item>
                    <Input
                        key={info.nickname} 
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder='请输入备注' onChange={e => this.setNickRemark(e)}
                        defaultValue={info.nick_remark}
                    />
                </Form.Item>
            </Form>
        </Modal>
    }
}

export default connect(
    state => ({friend: state.friend, chat: state.chat, user: state.user}), 
    { initChatInfo, modifyContacts, modifyFriendNickRemark }
)(withRouter(Profile))