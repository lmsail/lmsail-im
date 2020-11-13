import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Skeleton, Avatar, Badge, Menu, Dropdown } from 'antd'
import InputSearch from './search'
import { friendTimeShow } from '../../../utils'
import { initChatInfo, modifyContacts, changeRightType, removeContactItem } from '../../../redux/actions'

class Contacts extends Component {

    state = { friend_id: 0, index: 0 }

    render() {
        const {chat: {chatUserInfo: {friend_id}}, user: {contacts}} = this.props
        const menu = <Menu>
            <Menu.Item key="1" onClick={() => this.handleMenuEvent('remove')}>移除会话</Menu.Item>
            <Menu.Item key="2" onClick={() => this.handleMenuEvent('show')}>发起会话</Menu.Item>
            <Menu.Item key="3" onClick={() => this.handleMenuEvent('top')}>置顶会话</Menu.Item>
        </Menu>
        return (
            <div>
                <div className="user-search"><InputSearch/></div>
                <List className="conversation-list" itemLayout="horizontal"
                      split={false} dataSource={contacts} renderItem={(item, index) =>
                    (
                        <Dropdown overlay={menu} trigger={['contextMenu']}>
                            <List.Item onContextMenu={() => this.setSessionId(item.friend_id, index)}
                                className={item.friend_id !== friend_id || 'active'}
                                onClick={() => this.showMessageByUid(item.id)}
                            >
                                <Skeleton avatar loading={item.loading} active>
                                    <List.Item.Meta
                                        avatar={
                                            <Badge count={item.unread_num}>
                                                <Avatar shape="square" size="large" src={item.avatar} />
                                            </Badge>
                                        }
                                        title={item.nick_remark || item.nickname} description={item.last_mess}
                                    />
                                    <div className="timeDate">{friendTimeShow(item.created_at)}</div>
                                </Skeleton>
                            </List.Item>
                        </Dropdown>
                    )}
                />
            </div>
        )
    }

    setSessionId = (friend_id, index) => {
        this.setState({friend_id, index})
    }

    handleMenuEvent = type => {
        const {friend_id, index} = this.state
        let {user: {contacts}, chat: {chatUserInfo}} = this.props
        switch (type) {
            case 'remove': // 移除会话
                contacts.splice(index, 1) // 移除该会话元素
                if(contacts.length === 0 || chatUserInfo.friend_id === friend_id) {
                    this.props.changeRightType('welcome')
                }
                this.props.removeContactItem(friend_id, contacts)
                break
            case 'show': // 查看详情
                this.showMessageByUid(friend_id)
                break
            default: // 置顶会话
                contacts.unshift(contacts.splice(index, 1)[0])
                this.props.modifyContacts(contacts)
        }
    }

    showMessageByUid = uid => {
        const {user: { contacts, userInfo: { id } }, chat: { messList }} = this.props
        const index = contacts.findIndex(item => item.id === uid)
        contacts[index].unread_num = 0
        const { friend_id } = contacts[index]
        const key = id > friend_id ? `${friend_id}${id}` : `${id}${friend_id}`
        const needSend = !(messList && messList[key])
        this.props.initChatInfo(contacts[index], needSend)
    }
}

export default connect(
    state => ({chat: state.chat, user: state.user}),
    { initChatInfo, modifyContacts, changeRightType, removeContactItem }
)(Contacts)
