import React, { Component } from 'react'
import {Switch} from "antd";

export default class LoginSetting extends Component {
    render() {
        return (
            <div style={{ height: "100%" }}>
                <h2 className="main-title">登录设置</h2>
                <section className="set-content">
                    <div className="set-info loginPage">

                        <div className="switch-item">
                            <div className="item-title">自动登录</div>
                            <div className="item-desc">开启后，将会记住您的登录信息，下次打开自动登录</div>
                            <span className="item-switch">
                                <Switch checkedChildren="开" unCheckedChildren="关" />
                            </span>
                        </div>

                    </div>
                </section>
            </div>
        )
    }
}