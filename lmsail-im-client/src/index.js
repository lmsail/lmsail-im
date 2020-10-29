import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './redux/store'
import App from './pages/app'
import Login from './pages/login/login'
import Register from './pages/login/register'

import './assets/css/base.less'

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
                <Route component={App} />
            </Switch>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
)
