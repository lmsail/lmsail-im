import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import PubSub from 'pubsub-js'

import MessHeader from './header'
import MessHeaderGroup from './headerGroup'
import Message from './message'
import ChatTextarea from './textarea'

const { Header, Content, Footer } = Layout

class MessageLayout extends Component {

    state = { skin: null }

    componentDidMount() {
        PubSub.subscribe("changeSkin", (_, res) => this.setState({ skin: res.skin }))
        const skin = localStorage.getItem("message-skin")
        if(skin) this.setState({ skin })
    }

    render() {
        const { skin } = this.state
        return (
            <div className="message-container" style={{ backgroundImage: `url(${skin})` }}>
                <Header className='message-header'>{this.getChatHeaderDom()}</Header>
                <Content className='message-body'><Message /></Content>
                <Footer className='message-footer'><ChatTextarea /></Footer>
            </div>
        )
    }

    getChatHeaderDom = () => {
        const {chat: {chatUserInfo: { is_group }}} = this.props
        if(is_group && is_group === 1) {
            return <MessHeaderGroup />
        }
        return <MessHeader />
    }
}

export default connect(
    state => ({chat: state.chat}), { }
)(MessageLayout)
