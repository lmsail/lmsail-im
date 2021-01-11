import React, { Component } from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import { Link, withRouter } from 'react-router-dom'
import { Avatar, Icon, Menu, Layout, Badge, Tooltip, Modal, Row, Col } from 'antd'
import { getItem, setItem } from '../../utils'
import { skinList } from '../../config/skinConfig'
const { Sider } = Layout

class LeftNav extends Component {

    state = { screenType: 'fullscreen-exit', visible: false }

    componentDidMount() {
        this.resetFullScreen()
    }

    render() {
        const path = this.props.location.pathname
        const { user: { userInfo, unread }, friend: { newFriendNum } } = this.props
        if (!userInfo) return null
        return (
            <Sider className="left-nav" defaultCollapsed="true" collapsedWidth="68">
                <h2 className="user-avatar" onClick={this.toSetting}>
                    <Avatar shape="square" size="large" icon="user" src={userInfo.avatar} />
                </h2>
                <div className="menus">
                    <Menu theme="dark" mode="inline" selectedKeys={[path]}>
                        <Menu.Item key="/" title="消息">
                            <Link to="/"><Badge dot={unread > 0}><Icon type="message" /></Badge></Link>
                        </Menu.Item>
                        <Menu.Item key="/friend" title="通讯录">
                            <Link to="/friend"><Badge dot={newFriendNum > 0}><Icon type="team" /></Badge></Link>
                        </Menu.Item>
                        <Menu.Item key="download" title="下载源码">
                            <a href="https://github.com/lmsail/lmsail-im" target="_blank" rel="noopener noreferrer"><Icon type="github" /></a>
                        </Menu.Item>
                        <Menu.Item style={{ display: "none" }} key="" title="收藏">
                            <Link to=""><Icon type="star" /></Link>
                        </Menu.Item>
                        <Menu.Item style={{ display: "none" }} key="notice" title="通知">
                            <Link to="/notice"><Icon type="bell" /></Link>
                        </Menu.Item>
                    </Menu>
                </div>
                <div className="left-icon" style={{ bottom: "150px"}} onClick={() => this.showSkinModal(true)}>
                    <Tooltip title="换肤 - 聊天页"><Icon type="bg-colors" /></Tooltip>
                </div>
                <div className="left-icon" style={{ bottom: "90px"}} onClick={this.setFullScreen}>
                    <Icon type={this.state.screenType} />
                </div>
                <div className={['left-icon', path === '/setting' ? 'active' : null].join(' ')} onClick={this.toSetting}>
                    <Icon type="setting" theme="filled" />
                </div>
                {this.createSkinModal()}
            </Sider>
        )
    }

    createSkinModal = () => {
        const { visible } = this.state
        return <Modal visible={visible} title="换肤 - 作用于聊天页" footer={false} onCancel={() => this.showSkinModal(false)}>
            <Row gutter={16}>
                {
                    skinList.map((item, index) => {
                        return <Col key={index} className="gutter-row" span={8}>
                            <div className="gutter-box" onClick={() => this.setMessageBg(item)}>
                                <img src={item} alt="" /><span>选 择</span>
                            </div>
                        </Col>
                    })
                }
            </Row>
        </Modal>
    }

    showSkinModal = visible => {
        this.setState({ visible })
    }

    toSetting = () => {
        this.props.history.push({pathname: '/setting'})
    }

    setMessageBg = path => {
        this.setState({ visible: false })
        localStorage.setItem("message-skin", path)
        PubSub.publish("changeSkin", { skin: path })
    }

    resetFullScreen = () => {
        let screenType = getItem('screenType')
        if(screenType) {
            screenType = screenType === 'fullscreen' ? 'fullscreen-exit' : 'fullscreen'
            this.setState({ screenType })
        }
    }

    setFullScreen = () => {
        const { screenType } = this.state
        setItem('screenType', screenType)
        this.resetFullScreen()
        this.props.parent.setState({ screenType })
    }
}

export default connect(
    state => ({ user: state.user, friend: state.friend }), {}
)(withRouter(LeftNav))
