import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'

import spinner from '../assets/images/loading.gif'
import * as allConst from '../constants/index'

var serialize = require('form-serialize')

const statuses = [ allConst.STATUS_NEW, allConst.STATUS_WAIT, allConst.STATUS_ACTIVE, allConst.STATUS_EXECUTED ]

export default class EditOrderForm extends Component {
  constructor(props) {
    super(props)

    let orderId = this.props.match.params.orderId.slice(1)
    this.props.retrieveOrder(orderId)
  }

  componentDidUpdate() {
    if (this.orderForm && this.props.currentOrder.isFetched) {

      let current = this.props.currentOrder.data,
          form = this.orderForm,
          inputs = form.getElementsByTagName("input")
          
      for (let i of inputs) {
        let target

        for (let key in current) {
          if ( key === i.name ) {
            target = current[key]
          }
       
        }
     
        i.value = target
      }

    }      
  }

  submitOrderForm(e) {
    e.preventDefault()

    let current = this.props.currentOrder.data,
        form = this.orderForm,
        inputs = form.getElementsByTagName("input"),
        orderId = this.props.match.params.orderId.slice(1)

    for (let i of inputs) {

      for (let key in current) {
        if ( key === i.name ) {
          current[key] = i.value
        }
      }

    }

    current.status = this.setStatusSelect.value
    current.driver = this.setDriverSelect.value

    this.props.editOrder(current).then(() => {
        
      this.props.retrieveOrder(orderId).then(() => {
      
        this.props.retrieveOrders()
      })
    })
  }

  onReset(e) {
    e.preventDefault()

    let current = this.props.currentOrder.data,
        form = this.orderForm,
        inputs = form.getElementsByTagName("input")
          
    for (let i of inputs) {
      let target

      for (let key in current) {
        if ( key === i.name ) {
          target = current[key]
        }
      
      }
    
      i.value = target
    }
  }

  getDriverName(driverId) {
    let current = this.props.drivers.data.filter(drv => {
      return +drv.id === +driverId
    })

    current = current[0]

    return current.user.first_name || current.user.last_name ?

		`${current.user.first_name} ${current.user.last_name}` :

		current.user.username
  }

  render() {
    return (
      <div className="content-wrap">

        {!this.props.currentOrder.isFetched || !this.props.drivers.isFetched ? (
          
          <img className="spinner" src={spinner} />
        
        ) : (

          <div className="content">
            <form ref={(form) => this.orderForm = form} onSubmit={this.submitOrderForm.bind(this)}>

              <div className="content-label">
                <h1>Order #{this.props.currentOrder.data.id}</h1>
              </div>

              <div className="content-label">
                <h5>Информация о заказе:</h5>
              </div>

              <table className="default-table vertical">
                <tbody>
                  <tr>
                    <td>Transfer price</td><td><input type="text" name="transfer_price"/></td></tr>
                  <tr>
                    <td>Promo-code</td><td><input type="text" name="promo_code"/></td></tr>
                  <tr>
                    <td>Transfer-type</td><td><input type="text" name="transfer_type"/></td></tr>
                  <tr>
                    <td>Pick up location</td><td><input type="text" name="pick_up_location"/></td></tr>
                  <tr>
                    <td>Drop off location</td><td><input type="text" name="drop_off_location"/></td></tr>
                  <tr>
                    <td>Flight number</td><td><input type="text" name="flight_number"/></td></tr>
                  <tr>
                    <td>Transfer date</td><td><input type="text" name="transfer_date"/></td></tr>
                  <tr>
                    <td>Transfer time</td><td><input type="text" name="transfer_time"/></td></tr>
                  <tr>
                    <td>Return journey date</td><td><input type="text" name="return_journey_date"/></td></tr>
                  <tr>
                    <td>Return journey time</td><td><input type="text" name="return_journey_time"/></td></tr>
                  <tr>
                    <td>Discount</td><td><input type="text" name="discount"/></td></tr>
                  <tr>
                    <td>Adults</td><td><input type="text" name="adults"/></td></tr>
                  <tr>
                    <td>Children 0-9kg</td><td><input type="text" name="children_0_9"/></td></tr>
                  <tr>
                    <td>Children 9-18kg</td><td><input type="text" name="children_9_18"/></td></tr>
                  <tr>
                    <td>Children 18-36kg</td><td><input type="text" name="children_18_36"/></td></tr>
                  <tr>
                    <td>Car</td><td><input type="text" name="car_type"/></td></tr>
                  <tr>
                    <td>Customer name</td><td><input type="text" name="customer_name"/></td></tr>
                  <tr>
                    <td>Customer phone</td><td><input type="text" name="customer_phone"/></td></tr>
                  <tr>
                    <td>Customer email</td><td><input type="text" name="customer_email"/></td></tr>
                  <tr>
                    <td>Payment type</td><td><input type="text" name="payment_method"/></td></tr>
                  <tr>
                    <td>Card</td><td><input type="text" name="card"/></td></tr>
                  <tr>
                    <td>Comment</td><td><input type="text" name="comment"/></td></tr>
                </tbody>
              </table>

              <div className="table-footer">
                <div><h5>Date of creation:</h5> {this.props.currentOrder.data.date} </div>
              
                <label>Driver: 

                  <select ref={select => this.setDriverSelect = select}>

                    {this.props.drivers.data.map(d => {
                      
                      let current = this.props.currentOrder.data
                      
                      if ( current.driver && d.id === current.driver ) {
                        return (
                          <option value={d.id}>{this.getDriverName(d.id)}</option>
                        )
                      }
                    })}

                    {this.props.drivers.data.map(d => {
                      
                      let current = this.props.currentOrder.data

                      if ( current.driver && d.id !== current.driver ) {
                        return (
                          <option key={d.id} value={d.id}>{this.getDriverName(d.id)}</option>
                        )
                      }

                      if ( !current.driver  ) {
                        return (
                          <option key={d.id} value={d.id}>{this.getDriverName(d.id)}</option>
                        )
                      }

                    })}

                  </select>
                  
                </label>

                <label>Status:

                  <select ref={select => this.setStatusSelect = select} >
                    {statuses.map(s => {
                      let current = this.props.currentOrder.data

                      if ( s === current.status ) {
                        return (
                          <option key={s}>{s}</option>
                        )
                      }

                    })}

                    {statuses.map(s => {
                      let current = this.props.currentOrder.data
                      
                      if ( s !== current.status ) {
                        return (
                          <option key={s}>{s}</option>
                        )
                      }

                    })}

                  </select>

                </label>

              </div>

              <div className="btn-wrap">
                <button type="submit" className="button small">Accept</button>
                <button className="button small" onClick={(e) => this.onReset(e)}>Cancel</button>
              </div>

            </form>
          </div>

        )}

      </div>        
    );
  }
}