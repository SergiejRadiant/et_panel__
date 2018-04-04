import React, { Component } from 'react'
import logo from '../assets/images/logo.svg'

export default class LoginPage extends Component {
  submitForm(e) {
    e.preventDefault()
    
    let username = this.form.username.value,
        password = this.form.password.value,
        data = { username, password }

    this.props.onSubmit(data)
  }

  getAuthError() {
    if ( this.props.errors && this.props.errors.non_field_errors ) {
      return <p className="error-message with-btn-wrap">{this.props.errors.non_field_errors}</p>
    }
  }

  getUsernameError() {
    if ( this.props.errors && this.props.errors.username ) {
      return <p className="error-message">{this.props.errors.username}</p>
    }
  }

  getPasswordError() {
    if ( this.props.errors && this.props.errors.password ) {

      return <p className="error-message with-btn-wrap">{this.props.errors.password}</p>

    }
  }

  render() {
    return (
      <div className="page login-page">
        <div className="container">
          <div className="login-page-content">
            <div className="logo-wrap">
              <img className="logo" src={logo} alt="Logo" />
            </div>
            <form onSubmit={this.submitForm.bind(this)}
              className="form"
              action="#"
              ref={(form) => this.form = form}
            >
              <h4>Sign in to EXT Panel</h4>
              <label>Username: <input name="username" type="text" /></label>
              {this.getUsernameError()}
              <label>Password: <input name="password" type="password" /></label>
              {this.getPasswordError()}
              {this.getAuthError()}
              <div className="btn-wrap center">
                <button type="submit" className="button">Sign</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}