import React, { Component } from 'react'

import welcome from './welcome.png'
export default class Welcome extends Component {
    render() {
        return (
            <div className="empty-page">
                <img src={welcome} width="310" alt="欢迎" />
            </div>
        )
    }
}