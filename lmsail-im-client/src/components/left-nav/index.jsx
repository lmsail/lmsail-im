import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Avatar, Icon, Menu, Layout, Badge, Tooltip } from 'antd'
import { getItem, setItem } from '../../utils'
const { Sider } = Layout

class LeftNav extends Component {

    state = { screenType: 'fullscreen-exit' }

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
                        <Menu.Item key="" title="收藏">
                            <Link to=""><Icon type="star" /></Link>
                        </Menu.Item>
                        <Menu.Item key="notice" title="通知">
                            <Link to="/notice"><Icon type="bell" /></Link>
                        </Menu.Item>
                    </Menu>
                </div>
                {/* github 地址 */}
                <div className="github">
                    <Tooltip placement="top" title="下载源码">
                        <a href="https://github.com/lmsail/react-im-server/tree/v1" target="_blank" rel="noopener noreferrer">
                            <Icon type="github" />
                        </a>
                    </Tooltip>
                </div>
                {/* 全屏模式 */}
                <div className="setting" style={{ bottom: "90px"}} onClick={this.setFullScreen}>
                    <Icon type={this.state.screenType} />
                </div>
                <div className={['setting', path === '/setting' ? 'active' : null].join(' ')}
                     onClick={this.toSetting}
                >
                    <Icon type="setting" theme="filled" />
                </div>
            </Sider>
        )
    }

    toSetting = () => {
        this.props.history.push({pathname: '/setting'})
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
