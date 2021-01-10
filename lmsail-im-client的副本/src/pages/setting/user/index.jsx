import React, { Component } from 'react'

import UserInfo from '../../../components/commom/user-info'

export default class User extends Component {
    render() {
        return (
            <div style={{ height: "100%" }}>
                <h2 className="main-title">个人信息</h2>
                <section className="set-content">
                    <div className="set-info">
                        <UserInfo />
                    </div>
                </section>
            </div>
        )
    }
}