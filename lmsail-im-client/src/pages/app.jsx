import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from '../components/left-nav'
import Routers from '../router'
import { getItem } from '../utils'
import { MessServerConnect } from '../socket'

class App extends Component {

    state = { screenType: null, token: null, pathName: null }

    UNSAFE_componentWillMount() {
        const token = getItem('token')
        const screenType = getItem('screenType')
        const { pathname } = this.props.location
        this.setState({ screenType, token, pathName: pathname }) 
        if(token) {
            MessServerConnect(); // 连接 socket 服务器
        }
    }

    render() {
        const { pathName, token } = this.state
        const { redirectTo } = this.props.user
        if(pathName === '/register') return <Redirect to='/register' />
        if (!token || redirectTo === '/login') return <Redirect to='/login' />
        
        return (
            <Layout className={['container', this.state.screenType === 'fullscreen-exit' ? 'mini-pattern' : null].join(' ')}>
                <LeftNav parent={this} />
                <Switch>
                    {Routers.map(item => <Route exact path={item.path} component={item.components} key={item.path}/>)}
                    <Redirect to='/' />
                </Switch>
            </Layout>
        )
    }
}

export default connect(
    state => ({user: state.user}), {}
)(App)
