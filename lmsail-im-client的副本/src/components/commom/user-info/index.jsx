import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Avatar, Row, Col, Button, Modal, message as AM, Icon, Upload, Form, Input } from 'antd'
import { modifyUserInfo, modifyPassword, syncUserAvatar, logout } from '../../../redux/actions'
import { getItem } from '../../../utils'
import { serverUrl } from '../../../config/config'
import './user-info.less'

class UserInfo extends Component {

    state = {
        avatarVisible: false,
        infoVisible: false,
        passwordVisible: false,
        confirmLoading: false,
        fieldName: null, fieldValue: null, title: null,
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
        uploadDisabled: false
    }

    render() {
        const { userInfo } = this.props.user
        const { type, page, message } = this.props.globalResponse
        if(page === 'userInfo' && message) {
            type === 200 ? AM.success(message) : AM.error(message)
        }
        return (
            <div>
                <div className="basic-info border-b">
                    <div className="left">
                        <Avatar size={60} shape="square" src={userInfo.avatar} />
                        <div className="edit-avatar" onClick={() => this.changeModalStatus('avatar')}><Icon type="cloud-upload" /></div>
                    </div>
                    <div className="right">
                        <div className="user-name">{userInfo.nickname}</div>
                        <div className="user-desc">手机号：{userInfo.mobile || '未填写'}</div>
                    </div>
                    <div className="clearfix"/>
                </div>
                {this.getItemList()}
                <div className="btn-operation">
                    <Button type="danger" block={true} onClick={() => this.logout()}>退出登录</Button>
                    <Button block={true} onClick={() => this.changeModalStatus('password')}>修改密码</Button>
                </div>
                {this.createAvatarModal()}
            </div>
        )
    }

    // 显示或隐藏
    changeModalStatus = (name, visible = true) => {
        this.setState({ [`${name}Visible`]: visible })
    }

    // 实时修改字段值
    setFieldValue = e => {
        const fieldValue = e.target.value
        this.setState({ fieldValue })
    }

    // 实时修改输入框值
    setInputValue = (e, field) => {
        const value = e.target.value
        this.setState({ [field]: value })
    }

    // 设置需要修改的值模态框
    setModifyField = (fieldName, title) => {
        this.setState({ fieldName, title, infoVisible: true })
    }

    // 修改信息 action
    handleModifyInfo = () => {
        const { fieldName, fieldValue } = this.state
        this.setState({ confirmLoading: true, infoVisible: false })
        this.props.modifyUserInfo(fieldName, fieldValue)
        setTimeout(() => this.setState({ confirmLoading: false }), 500)
    }

    // 头像上传前验证 -> 限制格式，大小等
    beforeuploadAvatar = file => {
        const fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!fileTypes.includes(file.type)) {
            return AM.error('您只能上传JPG/PNG 文件!');
        }
        return file.size / 1024 < 100;
    }

    // 头像上传进度
    uploadProgress = info => {
        const { status, response } = info.file
        if(status === "uploading") {
            this.setState({ uploadDisabled: true })
        } else if (status === "done") {
            this.setState({ uploadDisabled: false, avatarVisible: false })
            this.props.syncUserAvatar(response.data)
            AM.success("头像上传成功")
        } else {
            this.setState({ uploadDisabled: false })
            AM.error("头像上传失败, 图片大小必须小于100KB!")
        }
    }

    getItemList = () => {
        const {user: {userInfo}} = this.props
        const itemList = [
            {itemName: "地区", itemValue: userInfo.area || '未设置', action: () => this.setModifyField('area', '地区')},
            {itemName: "昵称", itemValue: userInfo.nickname, action: () => this.setModifyField('nickname', '昵称')},
            {itemName: "手机号", itemValue: userInfo.mobile || '未设置', action: () => this.setModifyField('mobile', '手机号')},
            {itemName: "个性签名", itemValue: userInfo.autograph || '未设置', action: () => this.setModifyField('autograph', '个性签名')},
        ]
        return itemList.map((item, index) => (
            <Row className="user-item border-b" key={index}>
                <Col span={4}>{item.itemName}</Col>
                <Col span={20} onClick={item.action} style={{textAlign: "right", textIndent: 10}}>{item.itemValue}</Col>
            </Row>
        ))
    }

    createAvatarModal = () => {
        const { avatarVisible, infoVisible, passwordVisible, fieldName, title, confirmLoading, uploadDisabled } = this.state
        const { user: { userInfo } } = this.props
        const defaultValue = userInfo[fieldName]
        return (
            <div>
                {/* 头像上传模态框 */}
                <Modal visible={avatarVisible} title="上传头像" footer={false} onCancel={() => this.changeModalStatus('avatar', false)}>
                    <Upload.Dragger
                        name="file" multiple={false} showUploadList={false}
                        disabled={uploadDisabled}
                        beforeUpload={this.beforeuploadAvatar}
                        action={`${serverUrl}/user/avatar`}
                        onChange={this.uploadProgress}
                        headers={{ "Authorization": `Bearer ${getItem('token')}` }}
                    >
                        <p className="ant-upload-drag-icon">
                            <Icon type="cloud-upload" />
                        </p>
                        <p className="ant-upload-text">点击这里上传头像</p>
                    </Upload.Dragger>
                </Modal>

                {/* 更新用户信息的模态框 */}
                <Modal visible={infoVisible} title={`修改用户${title}`}
                    confirmLoading={confirmLoading}
                    onCancel={() => this.changeModalStatus('info', false)}
                    onOk={this.handleModifyInfo}
                >
                    <Form.Item>
                        <Input
                            key={title} defaultValue={defaultValue}
                            prefix={<Icon type="fire" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder={`请输入${title}`} onChange={e => this.setFieldValue(e)}
                        />
                    </Form.Item>
                </Modal>

                {/* 修改密码的模态框 */}
                <Modal visible={passwordVisible} title="修改密码"
                    onCancel={() => this.changeModalStatus('password', false)}
                    onOk={this.modifyPassword}
                >
                    { this.createFormInput('oldPassword', '旧密码') }
                    { this.createFormInput('newPassword', '新密码') }
                    { this.createFormInput('confirmPassword', '确认密码') }
                </Modal>
            </div>
        )
    }

    // 创建修改密码的输入框
    createFormInput = (field, placeholder) => {
        return <Form.Item>
            <Input
                type="password"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder={`请输入${placeholder}`} onChange={e => this.setInputValue(e, field)}
            />
        </Form.Item>
    }

    // 修改密码
    modifyPassword = () => {
        const { oldPassword, newPassword, confirmPassword } = this.state
        if(!oldPassword) return AM.error("请输入旧密码")
        if(!newPassword) return AM.error("请输入新密码")
        if(!confirmPassword) return AM.error("请再次输入新密码")
        if(newPassword !== confirmPassword) return AM.error("两次密码输入不一致")
        this.props.modifyPassword(oldPassword, newPassword)
        this.changeModalStatus('password', false)
    }

    logout = () => {
        const self = this
        Modal.confirm({
            title: '确定退出当前帐号吗？退出后无法接收在线消息哦！',
            content: '聊天记录不受影响，再次上线会自动推送离线消息',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                AM.loading('正在为您退出，请稍候...', 0);
                setTimeout(() => self.props.logout(), 500)
            },
        });
    }
}

export default connect(
    state => ({user: state.user, globalResponse: state.globalResponse}),
    { modifyUserInfo, modifyPassword, syncUserAvatar, logout }
)(withRouter(UserInfo))
