import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Input, List, Avatar, Divider, Button, Modal, Form, Icon, message as AM, Alert } from 'antd'
import { findUserList, addFriend } from '../../../redux/actions'

class NewFriend extends Component {

    state = { friend_id: 0, remark: null, visible: false, loading: false }

    render() {
        const { searchList } = this.props.user
        return (
            <div className="m-user-info">
                <h2 className="main-title">添加好友</h2>
                <div className="friend-list">
                <Alert message="搜索结果会自动过滤已是好友的用户" style={{marginBottom: 10}} banner type="info" showIcon />
                    <Input.Search placeholder="用户昵称" loading={this.state.loading} enterButton="查找" size="large" onSearch={value => this.searchAction(value)} />
                    <Divider orientation="left">本次搜索结果</Divider>
                    <List className="add-friend" itemLayout="horizontal" dataSource={searchList} split={false}
                        renderItem={item => (
                            <List.Item actions={[<Button type="primary" onClick={() => this.setFriendID(item.id)}>添加好友</Button>]}>
                                <List.Item.Meta
                                    avatar={<Avatar shape="square" size="large" src={item.avatar} />}
                                    title={item.nickname}
                                    description={item.autograph || '这个家伙很懒，什么都没留下！'}
                                />
                            </List.Item>
                        )}
                    />
                    { this.createRemarkModal() }
                </div>
            </div>
        )
    }

    createRemarkModal = () => {
        const { visible } = this.state
        return <Modal title="添加请求备注" visible={visible}
            onCancel={() => this.changeModalStatus(false)}
            onOk={this.addFriendAction}
        >
            <Form>
                <Form.Item>
                    <Input
                        prefix={<Icon type="fire" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder='请输入验证备注' onChange={e => this.setRemark(e)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    }

    searchAction = keyword => {
        if(!keyword) return AM.error('请输入用户昵称搜索')
        this.setState({ loading: true })
        this.props.findUserList(keyword, () => this.setState({ loading: false }))
    }

    changeModalStatus = visible => {
        this.setState({ visible })
    }

    // 设置当前好友ID
    setFriendID = friend_id => {
        this.setState({ friend_id, visible: true })
    }

    // 设置请求备注
    setRemark = e => {
        const remark = e.target.value
        this.setState({ remark })
    }

    // 添加好友
    addFriendAction = () => {
        const { friend_id, remark } = this.state
        this.props.addFriend(friend_id, remark)
        this.changeModalStatus(false)
    }
}

export default connect(
    state => ({user: state.user}), { findUserList, addFriend }
)(withRouter(NewFriend))
