import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'

import SettingNav from '../../components/setting-nav'
import SettingNavRouter from '../../config/settingNav'

const { Sider, Content } = Layout

export default class Setting extends Component {

    UNSAFE_componentWillMount() {
        this.ContentRouterDom = this.getContentDom()
    }

    render() {
        return <Layout>
            <Sider theme='light' className='setting-sider'><SettingNav /></Sider>
            <Layout className='setting-content'>
                <Content style={{ height: "100%" }}>
                    <Switch> { this.ContentRouterDom } </Switch>
                </Content>
            </Layout>
        </Layout>
    }

    getContentDom = () => {
        return SettingNavRouter.map(item => (
            <Route exact key={item.path} path={item.path} component={item.components} />
        ))
    }
}