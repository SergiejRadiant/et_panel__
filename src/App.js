import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'

import PrivateRoute from './containers/PrivateRoute'
import Login from './containers/Login'
import Admin from './containers/Admin'
import Driver from './containers/Driver'

import './assets/styles/app.css'

import getHistory from './store/history'
import configureStore from './store/index'

const  store = configureStore(getHistory())

window.store = store


export default class App extends Component {
	render() {
		return (
			<Provider key={module.hot ? Date.now() : store} store={store}>
				<BrowserRouter>
					<Switch>
						<Route path="/login" component={Login} />
						<PrivateRoute path="/admin" component={Admin} />
						<PrivateRoute path="/driver" component={Driver} />
						<Redirect to="/login" />
					</Switch>
				</BrowserRouter>
			</Provider>
		);
	}
}

