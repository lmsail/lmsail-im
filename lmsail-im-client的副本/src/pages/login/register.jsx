import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Button, Checkbox, Form, Icon, Input } from 'antd'
import { register } from '../../redux/actions'
import ReactLogo from "../../assets/images/about/react.png"

class Register extends Component {

    render() {
        const { form: { getFieldDecorator }, user: { msg, redirectTo } } = this.props
        if (redirectTo) {
            return <Redirect to={redirectTo} />
        }
        return (
            <div className="login-box" style={{ height: 560, top: 'calc(50% - 280px)' }}>
                <div className="login-logo">
                    <img src={ReactLogo} alt="" />
                    <h1 className="">IM USER REGISTER</h1>
                </div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    {msg ? <div className='error-msg'>{msg}</div> : null}
                    <Form.Item style={{ marginBottom: 15 }}>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入登录账号' }],
                        })(
                            <Input
                                size="large" placeholder="用户名"
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 15 }}>
                        {getFieldDecorator('nickname', {
                            rules: [{ required: true, message: '请输入昵称!' }],
                        })(
                            <Input
                                prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="text" size="large" placeholder="昵称"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 5 }}>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password" size="large" placeholder="密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 5 }}><Checkbox defaultChecked>同意<a href="http://www.lmsail.com" target="_blank" rel="noopener noreferrer">《聊天室规章制度》</a></Checkbox></Form.Item>
                    <Form.Item>
                        <Button type="primary" size="large" htmlType="submit" block>注册</Button>
                        <Button type="default" size="large" block onClick={this.login} style={{ marginTop: 15 }}>已有账号？登录</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.register(values.username, values.nickname, values.password)
            }
        })
    }

    login = () => {
        this.props.history.push({pathname: '/login'})
    }
}

export default connect(
    state => ({ user: state.user }), { register }
)(Form.create({ name: 'normal_register' })(Register))
