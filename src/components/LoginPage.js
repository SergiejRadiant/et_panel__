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
              <h4>Вход</h4>
              <label>Логин: <input name="username" type="text" /></label>
              <label>Пароль: <input name="password" type="password" /></label>
              <div className="btn-wrap center">
                <button type="submit" className="button">Вход</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}