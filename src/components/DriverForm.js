import React, { Component } from 'react';
import spinner from '../assets/images/loading.gif'

export default class DriverForm extends Component {
  constructor(props) {
    super(props)

    if(this.props.retrieveDriver) {
      let _driverId = this.props.match.params.driverId.slice(1)
      this.props.retrieveDriver(_driverId)
    }
  }

  componentDidUpdate() {
    if (this.props.retrieveDriver && this.props.currentDriver.isFetched) {
      let form = this.form,
          driver = this.props.currentDriver.data

      form.firstName.value = this.props.currentDriver.data.user.first_name
      form.lastName.value = driver.user.last_name
      form.username.value = driver.user.username
      form.password.value = driver.user.password
      form.email.value = driver.user.email
      form.car.value = driver.car
      form.carNumber.value = driver.car_number 
    } 
      
  }

  submitForm(e) {
    e.preventDefault()
    if (this.props.registerDriver) {
      let data = {
        ext_user: {
          is_admin: false,
          user: {
            first_name: this.form.firstName.value,
            last_name: this.form.lastName.value,
            email: this.form.email.value,
            username: this.form.username.value,
            password: this.form.password.value,
            last_login: null
          }
        },
        car: this.form.car.value,
        number_of_car: this.form.carNumber.value
      }
      
      this.props.registerDriver(data)   
    } else if (this.props.editDriver) {
      //______________________________
    }
 
    for (let i of this.form.getElementsByTagName('input')) {
      i.value = ""
    }
  }

  render() {
    return (
      <div className="content-wrap">
        {(this.props.retrieveDriver !== undefined && !this.props.currentDriver.isFetched) ? (
          <img className="spinner" src={spinner} />
        ) : (
          <form className="form" ref={(form) => this.form = form} onSubmit={this.submitForm.bind(this)}>
 
            <label>First name: <input type="text" name="firstName"/></label>

            <label>Last name: <input type="text"  name="lastName"/></label>

            <label>Car: <input type="text" name="car"/></label>

            <label>Car number: <input type="text" name="carNumber"/></label>

            <label>Username: <input type="text" name="username"/></label>

            <label>Email: <input type="email" name="email"/></label>

            <label>Password: <input type="text" name="password"/></label>
            
            <div className="btn-wrap">
              <button type="submit" className="button small">Принять</button>
              <button type="reset" className="button small">Отмена</button>
            </div>
          </form>
        )}
       </div>        
    );
  }
}