import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Modal from 'react-modal'
import spinner from '../assets/images/loading.gif'
import * as allConst from '../constants/index'


export default class DriverForm extends Component {
  constructor(props) {
    super(props) 

    if(this.props.retrieveDriver) {
      let driverId = this.props.match.params.driverId.slice(1)
      this.props.retrieveDriver(driverId)
    }
  }

  componentDidUpdate() {
    if (this.props.retrieveDriver && this.props.currentDriver.isFetched) {

      let form = this.form,
          driver = this.props.currentDriver.data

      form.firstName.value = this.props.currentDriver.data.user.first_name
      form.lastName.value = driver.user.last_name
      form.username.value = driver.user.username
      form.email.value = driver.user.email
      form.car.value = driver.car
      form.carNumber.value = driver.number_of_car

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
      
      this.props.registerDriver(data).then(() => {
        this.props.retrieveDrivers()
      })      

    } else if (this.props.editDriver) {
      let password = null,
          driverId = this.props.match.params.driverId.slice(1)

      if (this.form.password.value !== "") {
        password = this.form.password.value
      }
      
      let data = {
        first_name: this.form.firstName.value,
        last_name: this.form.lastName.value,
        email: this.form.email.value,
        username: this.form.username.value,
        password: password,
        car: this.form.car.value,
        number_of_car: this.form.carNumber.value
      }

      this.props.editDriver(data, driverId).then(() => {
        
        this.props.retrieveDriver(driverId).then(() => {
        
        this.props.retrieveDrivers()
      })
      })
    }
 
  }

  onReset(e) {
    e.preventDefault()

    if (this.props.editDriver) {

      let form = this.form,
        driver = this.props.currentDriver.data

      form.firstName.value = this.props.currentDriver.data.user.first_name
      form.lastName.value = driver.user.last_name
      form.username.value = driver.user.username
      form.car.value = driver.car
      form.carNumber.value = driver.number_of_car

    } else {

      for (let i of this.form.getElementsByTagName('input')) {
        i.value = ""
      }

    }
  }

  getUsernameError() {
    if
      (
        this.props.response
        && this.props.response.errors 
        && this.props.response.errors.ext_user 
     
      ) {

        return <p className="error-message">{this.props.response.errors.ext_user.user.username}</p>

      }
  }

  getPasswordError() {
    if
      (
        this.props.response 
        && this.props.response.errors 
        && this.props.response.errors.ext_user
     
      ) {

        return <p className="error-message with-btn-wrap">{this.props.response.errors.ext_user.user.password}</p> 

      }
  }

  getCarError() {
    if(
        this.props.response 
        && this.props.response.errors 
        && this.props.response.errors.car

      ) {

        return <p className="error-message">{this.props.response.errors.car}</p>
         
      }
  }

  getCarNumberError() {
    if(
        this.props.response 
        && this.props.response.errors 
        && this.props.response.errors.number_of_car

      ) {

        return <p className="error-message">{this.props.response.errors.number_of_car}</p> 

      }
  }

  getMessage() {
    if(
        this.props.response.isFetched
        && !this.props.response.errors.ext_user 
        && !this.props.response.errors.car 
        && !this.props.response.errors.number_of_car 

      ) {

        return (
          <p className="message">
            {`${this.props.response.message.toString()} `}
            <Link to='/admin/drivers'>Back to drivers.</Link>
          </p>
        )
      }
  }

  render() {
    return (
      <div className="content-wrap">
        {(this.props.retrieveDriver !== undefined && !this.props.currentDriver.isFetched) ? (
          <img className="spinner" src={spinner} />
        ) : (
          <form className="form" ref={(form) => this.form = form} onSubmit={(e) => this.submitForm(e)}>
 
            <label>First name: <input type="text" name="firstName"/></label>

            <label>Last name: <input type="text"  name="lastName"/></label>

            <label>Car: <input type="text" name="car"/></label>
            {this.getCarError()}

            <label>Car number: <input type="text" name="carNumber"/></label>
            {this.getCarNumberError()}

            <label>Username: <input type="text" name="username"/></label>
            {this.getUsernameError()}

            <label>Email: <input type="email" name="email"/></label>
          
            <label>Password: <input type="text" name="password"/></label>
            {this.getPasswordError()}
            {this.getMessage()}
            <div className="btn-wrap">
              <button type="submit" className="button small">Принять</button>
              <button className="button small" onClick={(e) => this.onReset(e)} >Отмена</button>
            </div>
          </form>
        )}

      </div>        
    );
  }
}