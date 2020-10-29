/**
 * layout 左右布局，适用于 通讯录 与 会话列表 页面
 */
import React, {Component} from 'react'
import {Route, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Layout} from 'antd'

import Welcome from '../welcome'
import UserInfo from '../../pages/maillist/friend/profile'
import ChatMessage from '../../pages/chat/message'
import FriendApply from '../../pages/maillist/friend/newfriend'
import AddFriend from '../../pages/maillist/friend/addfriend'

const {Sider} = Layout

class LayoutMain extends Component {

    static propTypes = {
        router: PropTypes.object.isRequired,
    }

    render() {
        const {router, chat: {showRightType}} = this.props
        return (
            <Layout>
                <Sider className="contacts-list" defaultCollapsed="true" collapsedWidth="251" theme="light">
                    <Route path={router.path} component={router.components}/>
                </Sider>
                <Layout className="layout-right">
                    {this.getRenderRight(showRightType)}
                </Layout>
            </Layout>
        )
    }

    getRenderRight = showRightType => {
        switch(showRightType) {
            case 'welcome':
                return <Welcome />
            case 'userInfo':
                return <UserInfo />
            case 'newFriend':
                return  <FriendApply />
            case 'addFriend':
                return <AddFriend />
            default:
                return <ChatMessage />
        }
    }
}

export default connect(
    state => ({chat: state.chat}), {}
)(withRouter(LayoutMain))
