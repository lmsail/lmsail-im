import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import menuList from '../../config/settingMenu'

class SettingNav extends Component {

    UNSAFE_componentWillMount() {
        this.menuDoms = this.getMenuDom()
    }

    getMenuDom = () => {
        return menuList.map(item => (
            <Menu.Item key={item.path}>
                <Link to={item.path}><Icon type={item.icon} /> {item.title}</Link>
            </Menu.Item>
        ))
    }

    render() {
        const path = this.props.location.pathname
        return (
            <div className="setting-menu">
                <h2>设置</h2>
                <Menu selectedKeys={path}>{ this.menuDoms }</Menu>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    {}
)(withRouter(SettingNav))