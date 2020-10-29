import React, { Component } from 'react'
import {Switch} from "antd";

export default class PageSetting extends Component {
    render() {
        return (
            <div style={{ height: "100%" }}>
                <h2 className="main-title">界面设置</h2>
                <section className="set-content">
                    <div className="set-info interface">

                        <div className="switch-item">
                            <div className="item-title">默认全屏显示</div>
                            <div className="item-desc">开启后，将会默认全屏显示</div>
                            <span className="item-switch">
                                <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
                            </span>
                        </div>

                    </div>
                </section>
            </div>
        )
    }
}