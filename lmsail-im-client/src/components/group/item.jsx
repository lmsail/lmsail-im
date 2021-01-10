import React, { Component } from 'react'
import PropTypes from "prop-types";

class GroupItem extends Component {

    static propTypes = {
        groupInfo: PropTypes.object.isRequired,
    }

    render() {
        const { groupInfo } = this.props
        // console.log('群成员信息', groupInfo)
        return <div className="group-item">
            <div className="ant-list-item-meta">
                <div className="ant-list-item-meta-avatar">
                    <span className="ant-badge">
                        {this.createGroupMemberDom(groupInfo.member)}
                    </span>
                </div>
                <div className="ant-list-item-meta-content">
                    <h4 className="ant-list-item-meta-title">lmsail-im测试群</h4>
                    <div className="ant-list-item-meta-description">郑爽：这个群不错啊！</div>
                </div>
            </div>
            <div className="timeDate">18:53</div>
        </div>
    }

    createGroupMemberDom = () => {
        return <div className="headGroup avatar_8">
            <img src="http://react-server.lmsail.com/avatar/2020-11-10/50ce4eb44e.jpg" alt="user" />
            <img src="http://react-server.lmsail.com/default/default-1.png" alt="user" />
            <img src="http://react-server.lmsail.com/default/default-2.png" alt="user" />
            <img src="http://react-server.lmsail.com/default/default-3.png" alt="user" />
            <img src="http://react-server.lmsail.com/default/default-4.png" alt="user" />
            <img src="http://react-server.lmsail.com/default/default-5.png" alt="user" />
            <img src="http://react-server.lmsail.com/default/default-2.png" alt="user" />
            <img src="http://react-server.lmsail.com/default/default-3.png" alt="user" />
            <img src="http://react-server.lmsail.com/default/default-4.png" alt="user" />
        </div>
    }
}
export default GroupItem
