import React, { Component } from 'react'
import { Row, Col, Avatar, Switch } from 'antd'

class GroupDetails extends Component {

    state = { showDetails: false }

    render() {
        const { showDetails } = this.state
        return <div className={["group-details ", showDetails ? "in" : null].join(' ')}>
            {/* 群成员列表 */}
            <div className="title">群成员（29人）</div>
            <Row gutter={16} className="member">
                {this.createMemberDom()}
            </Row>

            {/* 群设置 */}
            <div className="title" style={{ margin: "10px 0 5px 0" }}>群设置</div>
            <div className="group-setting">
                <Row className="setting-item">
                    <Col span={12}>群名称</Col>
                    <Col className="text-right text-secondary" span={12}>测试群</Col>
                </Row>
                <Row className="setting-item">
                    <Col span={12}>我在本群的昵称</Col>
                    <Col className="text-right text-secondary" span={12}>M先生</Col>
                </Row>
                <Row className="setting-item">
                    <Col span={12}>群公告</Col>
                    <Col className="text-right text-secondary" span={12}>测试名称</Col>
                </Row>
                <Row className="setting-item">
                    <Col span={12}>置顶聊天</Col>
                    <Col className="text-right" span={12}>
                        <span className="item-switch">
                            <Switch checkedChildren="开" unCheckedChildren="关" />
                        </span>
                    </Col>
                </Row>
                <Row className="setting-item">
                    <Col span={12}>消息免打扰</Col>
                    <Col className="text-right" span={12}>
                        <span className="item-switch">
                            <Switch checkedChildren="开" unCheckedChildren="关" />
                        </span>
                    </Col>
                </Row>
                <div className="group-leave">离开群</div>
            </div>
        </div>
    }

    createMemberDom = () => {
        const memberList = [
            { nickname: '马云', avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582778785114&di=4bf0a9cbe00cd200465af9fe46b3091e&imgtype=0&src=http%3A%2F%2Fwww.56ec.org.cn%2Fd%2Ffile%2Fnews%2Frwgd%2F2017-05-15%2Fa26c40ec7d83c66d78ad6f791952a01b.jpg' },
            { nickname: 'Antd', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
            { nickname: '高圆圆', avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3410711718,4003146871&fm=26&gp=0.jpg' },
            { nickname: '刘亦菲', avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599725631785&di=222a2b16665394534032652c8b7234ea&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170828%2Fbca4530398cb45caa3101da954bc8a81.jpeg' },
            { nickname: '宋茜', avatar: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4082095625,4197768517&fm=26&gp=0.jpg' },
            { nickname: '王者荣耀', avatar: 'http://react-server.lmsail.com/avatar/2020-11-10/50ce4eb44e.jpg' },
            { nickname: '赵露思', avatar: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2714458446,426719835&fm=26&gp=0.jpg' },
            { nickname: '郑爽', avatar: 'http://img1.imgtn.bdimg.com/it/u=1186528863,3178811360&fm=26&gp=0.jpg' },
            { nickname: '郑爽', avatar: 'http://img1.imgtn.bdimg.com/it/u=1186528863,3178811360&fm=26&gp=0.jpg' },
            { nickname: '王健林', avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582778837077&di=f569a7c9412eae7b1068ee89ccc9aa9f&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20170709%2Fc266207e9ec74666b4dee5f74c634ae1_th.jpg' },
            { nickname: '添加', avatar: '' },
        ];
        return memberList.map((item, index) => <Col key={index} className="member-item" span={6}>
                <Avatar size="large" src={item.avatar} icon="usergroup-add" />
                <div className="username">{item.nickname}</div>
            </Col>
        )
    }
}
export default GroupDetails