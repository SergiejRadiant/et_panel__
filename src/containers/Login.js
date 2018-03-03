import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from  'react-router'

import LoginPage from '../components/LoginPage'

import { authErrors, isAuthenticated } from '../reducers/index'
import { login } from '../actions/index'


const Login = (props) => {
	if (props.auth.isAuthenticated && props.auth.isAdmin) {
		return (
			<Redirect to='/admin' />
		)
	}
	if (props.auth.isAuthenticated) {
		return (
			<Redirect to='/driver' />
		)
	}
	return (
		<LoginPage {...props} />
	)
}


const mapStateToProps = (state) => ({
	errors: authErrors(state),
	auth: isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
	onSubmit: (data) => {
		dispatch(login(data))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

