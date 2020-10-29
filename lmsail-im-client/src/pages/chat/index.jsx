import React, {Component} from 'react'

import LayoutMain from '../../components/layout'
import Contacts from './contacts'

class ChatContainer extends Component {
    render() {
        return (
            <LayoutMain router={{path: '/', components: Contacts}}/>
        )
    }
}

export default ChatContainer