import React, { Component } from 'react'
import { Input, Row, Col } from 'antd'

const { Search } = Input
export default class InputSearch extends Component {
    render() {
        return  <Row>
            <Col span={24}>
                <Search placeholder="搜索好友昵称" className="input-search" onSearch={value => console.log(value)} />
            </Col>
        </Row>
    }
}