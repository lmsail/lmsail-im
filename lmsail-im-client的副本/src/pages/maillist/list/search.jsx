import React, { Component } from 'react'
import { Input, Row, Col, Button } from 'antd'
import { connect } from 'react-redux'
import { changeRightType } from '../../../redux/actions'

const { Search } = Input
class InputSearch extends Component {
    render() {
        return <Row gutter={[8, 8]}>
            <Col span={20}>
                <Search placeholder="搜索好友昵称" className="input-search" onSearch={value => console.log(value)} />
            </Col>
            <Col span={4}><Button icon="plus" className="btn-plus" onClick={this.showAddFriend} /></Col>
        </Row>
    }

    showAddFriend = () => {
        this.props.parent.removeSelect()
        this.props.changeRightType('addFriend')
    }
}

export default connect(
    state => ({friend: state.friend}), {changeRightType}
)(InputSearch)