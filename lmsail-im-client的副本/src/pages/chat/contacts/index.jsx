import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Skeleton, Avatar, Badge, Menu, Dropdown } from 'antd'
import InputSearch from './search'
import { friendTimeShow } from '../../../utils'
import { initChatInfo, modifyContacts, changeRightType, removeContactItem } from '../../../redux/actions'
import GroupItem from '../../../components/group/item'

class Contacts extends Component {

    state = { friend_id: 0, index: 0, groupInfo: null }

    componentDidMount() {
        const groupInfo = {
            id: -1, user_id: 1, friend_id: 99, last_mess: '郑爽：这是什么鬼？', unread_num: 0, is_group: 1,
            group_name: 'lmsail-im 测试群',
            member: [
                // {avatar: 'http://react-server.lmsail.com/default/default-1.png', nickname: '郑爽'},
                // {avatar: 'http://react-server.lmsail.com/default/default-2.png', nickname: '吞拿鱼'},
                // {avatar: 'http://react-server.lmsail.com/default/default-3.png', nickname: '宋茜'},
                // {avatar: 'http://react-server.lmsail.com/default/default-4.png', nickname: '马云'},
                // {avatar: 'http://react-server.lmsail.com/default/default-5.png', nickname: '王健林'},
                // {avatar: 'http://react-server.lmsail.com/default/default-4.png', nickname: '马云'},
                // {avatar: 'http://react-server.lmsail.com/default/default-2.png', nickname: '吞拿鱼'},
                // {avatar: 'http://react-server.lmsail.com/default/default-3.png', nickname: '宋茜'},
                // {avatar: 'http://react-server.lmsail.com/avatar/2020-11-10/50ce4eb44e.jpg', nickname: '王者荣耀'},
            ]
        }
        this.setState({ groupInfo })
    }

    render() {
        let {user: {contacts}} = this.props
        contacts = this.unshiftContacts(contacts)
        const menu = <Menu>
            <Menu.Item key="1" onClick={() => this.handleMenuEvent('remove')}>移除会话</Menu.Item>
            <Menu.Item key="2" onClick={() => this.handleMenuEvent('show')}>发起会话</Menu.Item>
            <Menu.Item key="3" onClick={() => this.handleMenuEvent('top')}>置顶会话</Menu.Item>
        </Menu>
        return (
            <div>
                <div className="user-search"><InputSearch/></div>
                <List className="conversation-list" itemLayout="horizontal" split={false} dataSource={contacts}
                    renderItem={(item, index) => (
                        <Dropdown overlay={menu} trigger={['contextMenu']}>
                            {this.createListItemDom(item, index)}
                        </Dropdown>
                    )}
                />
            </div>
        )
    }

    // 生成聊天列表会话节点
    createListItemDom = (item, index) => {
        const {chat: {chatUserInfo: {friend_id}}} = this.props
        if(item.member) {
            return <List.Item onClick={() => this.joinGroupRoom(index)}><GroupItem groupInfo={this.state.groupInfo} /></List.Item>
        }
        return <List.Item onContextMenu={() => this.setSessionId(item.friend_id, index)}
            className={item.friend_id !== friend_id || 'active'}
            onClick={() => this.joinPrivateRoom(item.id)}
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
    }

    // 向 contacts 前追加群数据
    // TODO 这里仅仅是模拟，后续改为动态
    unshiftContacts = contacts => {
        const { groupInfo } = this.state
        if(groupInfo) {
            const index = contacts.findIndex(item => item.member)
            if(index < 0) contacts.unshift(groupInfo)
            return contacts
        }
        return []
    }

    setSessionId = (friend_id, index) => {
        this.setState({friend_id, index})
    }

    handleMenuEvent = type => {
        const {friend_id, index} = this.state
        let {user: {contacts}, chat: {chatUserInfo}} = this.props
        switch (type) {
            case 'remove': // 移除会话
                contacts.splice(index, 1)
                if(contacts.length === 0 || chatUserInfo.friend_id === friend_id) {
                    this.props.changeRightType('welcome')
                }
                this.props.removeContactItem(friend_id, contacts)
                break
            case 'show': // 查看详情
                this.joinPrivateRoom(0, index)
                break
            default: // 置顶会话
                contacts.unshift(contacts.splice(index, 1)[0])
                this.props.modifyContacts(contacts)
        }
    }

    // 进入私聊房间
    joinPrivateRoom = (id, index = 0) => {
        const {user: { contacts, userInfo: { id: user_id } }, chat: { messList }} = this.props
        index = index > 0 ? index : contacts.findIndex(item => item.id === id)
        contacts[index].unread_num = 0
        const { friend_id } = contacts[index]
        const key = user_id > friend_id ? `${friend_id}${user_id}` : `${user_id}${friend_id}`
        const needSend = !(messList && messList[key])
        this.props.initChatInfo(contacts[index], needSend)
    }

    // 进入群聊房间
    joinGroupRoom = (id, index = 0) => {
        const { user: { contacts } } = this.props
        this.props.initChatInfo(contacts[index], false)
    }
}

export default connect(
    state => ({chat: state.chat, user: state.user}),
    { initChatInfo, modifyContacts, changeRightType, removeContactItem }
)(Contacts)
