import React, { Component } from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import { List, Skeleton, Avatar, Badge, Menu, Dropdown } from 'antd'
import InputSearch from './search'
import { friendTimeShow } from '../../../utils'
import { initChatInfo, modifyContacts, changeRightType } from '../../../redux/actions'

class Contacts extends Component {

    state = { user_id: 0, index: 0 }

    render() {
        const {chat: {chatUserInfo: {id}}, user: {contacts}} = this.props
        const menu = <Menu>
            {/* <Menu.Item key="1" onClick={() => this.handleMenuEvent('remove')}>移除会话</Menu.Item> */}
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
                            <List.Item onContextMenu={() => this.setSessionId(item.id, index)}
                                className={item.id !== id || 'active'}
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

    setSessionId = (user_id, index) => {
        this.setState({user_id, index})
    }

    handleMenuEvent = type => {
        const {user_id, index} = this.state
        let {user: {contacts}} = this.props
        switch (type) {
            // case 'remove': // 移除会话
            //     contacts.splice(index, 1) // 移除该会话元素
            //     this.props.modifyContacts(contacts)
            //     if(contacts.length === 0 || chatUserInfo.id === user_id) {
            //         this.props.changeRightType('welcome')
            //     }
            //     break
            case 'show': // 查看详情
                this.showMessageByUid(user_id)
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
        PubSub.publish('initMessageState')
    }
}

export default connect(
    state => ({chat: state.chat, user: state.user}),
    { initChatInfo, modifyContacts, changeRightType }
)(Contacts)
