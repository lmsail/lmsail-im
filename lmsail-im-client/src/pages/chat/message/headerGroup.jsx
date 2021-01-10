import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Avatar, Row, Col, Icon } from 'antd'

import { setFriendInfo } from '../../../redux/actions/FriendActions'

class MessHeaderGroup extends Component {

    render() {
        const { chat: { chatUserInfo: { avatar, nickname, nick_remark }, chatUserInfo }} = this.props
        return <Row>
            <Col span={20}>
                <Avatar shape="square" size={36} src={avatar} />
                <span style={{ fontSize: 18, marginLeft: 10, color: "#000" }}>{nick_remark || nickname}</span>
            </Col>
            <Col span={4}>
                <div style={{ textAlign: "right" }}>
                    <Icon type="more" rotate="90" className="icon-more" onClick={() => this.showUserInfo(chatUserInfo)} />
                </div>
            </Col>
       </Row>
    }

    showUserInfo = userInfo => {
        this.props.setFriendInfo(userInfo)
    }
}

export default connect(
    state => ({ chat: state.chat }), {setFriendInfo}
)(withRouter(MessHeaderGroup))
