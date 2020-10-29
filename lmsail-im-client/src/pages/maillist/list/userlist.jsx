import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Avatar, Badge } from 'antd'

import InputSearch from './search'
import { setFriendInfo, changeRightType, getNewFriendList } from '../../../redux/actions'
import newFriend from '../../../assets/images/icon/newfriend.png'
import groupIcon from '../../../assets/images/icon/qunliao.png'

class UserList extends Component {

    state = { user_id: 0 }

    render() {
        const { user_id } = this.state
        const { friend: { newFriendNum } } = this.props
        return (
            <div className="mail-users">
                <div className="user-search"><InputSearch parent={this} /></div>
                <div className={['mail-users-item', user_id === -1 ? 'active' : null].join(' ')} onClick={this.showNewFriend}>
                    <img src={newFriend} alt="new-friend"/> 新的朋友 <span className="new-friend-num"><Badge count={newFriendNum} /></span>
                </div>
                <div className="mail-users-item" style={{display: "none"}}
                     onClick={this.showNewFriend}>
                    <img src={groupIcon} alt="new-friend"/> 创建群聊
                </div>
                <div className="mail-list">{this.createMailListDom(user_id)}</div>
            </div>
        )
    }

    showNewFriend = () => {
        this.setState({user_id: -1})
        this.props.changeRightType('newFriend')
        this.props.getNewFriendList()
    }

    removeSelect = () => {
        this.setState({ user_id: 0 })
    }

    showUserInfo = user_id => {
        this.setState({user_id})
        this.props.setFriendInfo(this.getUserInfoById(user_id))
    }

    // 取出指定用户信息
    getUserInfoById = user_id => {
        const {friend: {mailList}} = this.props
        const users = mailList.map(item => item.data.find(user => user.id === user_id))
        return users.find(user => user && user.id === user_id)
    }

    createMailListDom = user_id => {
        const {friend: {mailList}} = this.props
        return mailList.map(item => (
            <div className="m-list-item" key={item.letter}>
                <div className="m-list-title">{item.letter}</div>
                <List className="m-list-user" itemLayout="horizontal" dataSource={item.data} split={false}
                      renderItem={user => (
                          <List.Item
                              className={user_id === user.id ? 'active' : null}
                              onClick={() => this.showUserInfo(user.id)}
                          >
                              <List.Item.Meta
                                  avatar={<Avatar shape="square" size="large" src={user.avatar}/>}
                                  title={user.nick_remark ? `${user.nick_remark} (${user.nickname})` : user.nickname}
                              />
                          </List.Item>
                      )}
                />
            </div>
        ))
    }
}

export default connect(
    state => ({friend: state.friend}),
    { setFriendInfo, changeRightType, getNewFriendList }
)(UserList)