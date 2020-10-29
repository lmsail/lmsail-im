import React, { Component } from 'react'
import { Layout } from 'antd'

import MessHeader from './header'
import Message from './message'
import ChatTextarea from './textarea'

const { Header, Content, Footer } = Layout

export default class MessageLayout extends Component {
    render() {
        return (
            <div className="message-container">
                <Header className='message-header'><MessHeader /></Header>
                <Content className='message-body'><Message /></Content>
                <Footer className='message-footer'><ChatTextarea /></Footer>
            </div>
        )
    }
}