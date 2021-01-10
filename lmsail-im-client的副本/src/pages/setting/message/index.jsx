import React, { Component } from 'react'
import { Switch } from 'antd'

export default class MessageSetting extends Component {
    render() {
        return (
            <div style={{ height: "100%" }}>
                <h2 className="main-title">消息设置</h2>
                <section className="set-content">
                    <div className="set-info loginSetting">
                        <div className="switch-item">
                            <div className="item-title">桌面通知</div>
                            <div className="item-desc">开启后，新消息到达时将显示桌面通知</div>
                            <span className="item-switch">
                                <Switch checkedChildren="开" unCheckedChildren="关" />
                            </span>
                        </div>

                        <div className="switch-item no-border">
                            <div className="item-title">声音提醒</div>
                            <div className="item-desc">开启后，新消息到达时将有声音提醒</div>
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