import React, { Component } from 'react'
import Modal from 'react-modal'
import spinner from '../assets/images/loading.gif'
import * as allConst from '../constants/index'


export default class DriverForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messageModalIsOpen: false
    }

    this.openMessageModal = this.openMessageModal.bind(this)
    this.closeMessageModal = this.closeMessageModal.bind(this)

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
      form.car.value = driver.car
      form.carNumber.value = driver.number_of_car

    }
  }

  componentWillReceiveProps() {
    if (this.props.registerDriver && !this.props.errors && this.props.message) {
      this.openMessageModal()
    }
  }

  openMessageModal() {
    this.setState({ messageModalIsOpen: true });
  }

  closeMessageModal() {
    this.setState({ messageModalIsOpen: false });
  }

  getUsernameError() {
    if (this.props.errors && this.props.errors.ext_user && this.props.errors.ext_user.user.username) {
      return <p className="error-message">{this.props.errors.ext_user.user.username}</p> 
    }
  }

  getPasswordError() {
    if (this.props.errors && this.props.errors.ext_user && this.props.errors.ext_user.user.password) {
      return <p className="error-message with-btn-wrap">{this.props.errors.ext_user.user.password}</p> 
    }
  }

  getCarError() {
    if (this.props.errors && this.props.errors.car) {
      return <p className="error-message">{this.props.errors.car}</p> 
    }
  }

  getCarNumberError() {
    if (this.props.errors && this.props.errors.number_of_car) {
      return <p className="error-message">{this.props.errors.number_of_car}</p> 
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
      let password = null

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

      let driverId = this.props.match.params.driverId.slice(1)
      this.props.editDriver(data, driverId)
      this.props.retrieveDriver(driverId)
    }
 
    for (let i of this.form.getElementsByTagName('input')) {
      i.value = ""
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

    } else  {

      for (let i of this.form.getElementsByTagName('input')) {
        i.value = ""
      }

    }
  }

  goDriverList() {
    localStorage.setItem('adminLocation', '/admin/drivers')
    this.props.history.push('/')
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

            <div className="btn-wrap">
              <button type="submit" className="button small">Принять</button>
              <button className="button small" onClick={(e) => this.onReset(e)} >Отмена</button>
            </div>
          </form>
        )}

        <Modal
          isOpen={this.state.messageModalIsOpen}
          onRequestClose={this.closeMessageModal}
          style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
          className="modal"
          ariaHideApp={false}
        >
          <p>{this.props.message ? this.props.message.toString() : null}</p>
          <div className="btn-wrap">
            <button className="button small" onClick={() => this.goDriverList()}>Go back</button>
            <button className="button small" onClick={() => this.closeMessageModal()}>Close</button>
          </div>
        </Modal>

      </div>        
    );
  }
}