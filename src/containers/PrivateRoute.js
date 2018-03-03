import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import * as reducers from '../reducers'


const PrivateDriver = ({ component: Component, auth, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuthenticated ? (
      <Component {...props} />
    ) : (
        <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
      )
  )} />
)


const mapStateToProps = (state) => ({
  auth: reducers.isAuthenticated(state)
})

export default connect(mapStateToProps, null)(PrivateDriver)