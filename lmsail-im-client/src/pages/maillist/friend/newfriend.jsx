import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Avatar, List, Button } from 'antd'
import { friendTimeShow } from '../../../utils'
import { handleFriendVerify } from '../../../redux/actions'

class NewFriend extends Component {

    render() {
        return (
            <div className="m-user-info">
                <h2 className="main-title">好友申请</h2>
                <div className="friend-list">{this.createMailListDom()}</div>
            </div>
        )
    }

    createMailListDom = () => {
        let { friend: { newFriend } } = this.props
        if(newFriend === null) newFriend = []
        return (
            <div className="m-list-item">
                <List split={true} className="m-list-user" itemLayout="horizontal" dataSource={newFriend}
                      renderItem={user => (
                          <List.Item key={user.user_id} actions={this.createOptionButton(user)}>
                              <List.Item.Meta
                                  avatar={<Avatar shape="square" size="large" style={{marginTop: 1}} src={user.avatar}/>}
                                  title={user.nickname} description={`附言：${user.remark}`}
                              />
                              <div style={{color: "#ccc"}}>{friendTimeShow(user.created_at)}</div>
                          </List.Item>
                      )}
                />
            </div>
        )
    }

    createOptionButton = user => {
        const { user_id, status } = user
        const statusTemp = {
            0: [<Button type="primary" onClick={() => this.handleVerify(user_id, 1)}>接受</Button>, <Button type="danger" onClick={() => this.handleVerify(user_id, 2)}>拒绝</Button>],
            1: ['已通过'],
            2: [<span style={{color: 'red'}}>已拒绝</span>]
        }
        return statusTemp[status]
    }

    handleVerify = (user_id, option) => {
        this.props.handleFriendVerify(user_id, option)
    }
}

export default connect(
    state => ({friend: state.friend, chat: state.chat}), { handleFriendVerify }
)(withRouter(NewFriend))