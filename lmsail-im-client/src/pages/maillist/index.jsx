import React, { Component } from 'react'
import { connect } from 'react-redux'

import UserList from './list/userlist'
import LayoutMain from '../../components/layout'

class MailList extends Component {
    render() {
        return (
            <LayoutMain router={{ path: '/friend', components: UserList }} />
        )
    }
}

export default connect(
    state => ({ chat: state.chat }), {}
)(MailList)