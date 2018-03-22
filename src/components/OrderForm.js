import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

var serialize = require('form-serialize')


export default class OrderForm extends Component {
  submitOrderForm(e) {
    e.preventDefault()

    let newOrder = serialize(this.orderForm, { hash: true })
    
    newOrder.transfer_date = moment(newOrder.transfer_date).format('YYYY-MM-DD')

    if (newOrder.return_journey_date) {
      newOrder.return_journey_date = moment(newOrder.return_journey_date).format('YYYY-MM-DD')
    }

    newOrder.driver = null

    this.props.registerOrder(newOrder).then(() => {
      
      this.props.retrieveOrders()
    })
  }

  getMessage() {
    
    if( this.props.response.isFetched ) {
      
      return (
        
        <p className="message">
          {`${this.props.response.message.toString()} `}
          <Link to='/admin/orders'>Back to orders.</Link>
        </p>

      )
    }
  }

  render() {
    return (
      <div className="content-wrap">
        <div className="content">
          <form ref={(form) => this.orderForm = form} onSubmit={this.submitOrderForm.bind(this)} >
            <div className="content-box">
              <div className="content-box-row">

                <div className="content-box-cell">

                  <label>Pick up location: <input type="text" name="pick_up_location" /></label>
                  <label>Drop off location: <input type="text" name="drop_off_location" /></label>
                  
                  <label>Transfer date: <input type="date" name="transfer_date" /></label>
                  <label>Transfer time: <input type="time" name="transfer_time" /></label>
                 
                  <div className="radio-wrap">
                    <label>Round trip:<input type="radio" name="transfer_type" value="Round trip" /></label>
                    <label>One way:<input type="radio" name="transfer_type" value="One way" /></label>
                  </div>

                  <label>Return journey date: <input type="date" name="return_journey_date" /></label>
                  <label>Return journey time: <input type="time" name="return_journey_time" /></label>
                  <label>Flight number: <input type="text" name="flight_number" /></label>

                </div>

                <div className="content-box-cell">
                 
                  <label>Adults: <input type="number" name="adults" /></label>
                  <label>Children 0-9kg: <input type="number" name="children_0_9" /></label>
                  <label>Children 9-18kg: <input type="number" name="children_9_18" /></label>
                  <label>Children 18-36kg: <input type="number" name="children_18_36" /></label>
                  
                  <div className="radio-wrap">
                    <label>Business class:<input type="radio" name="car_type" value="Business class" /></label>
                    <label>Minivan:<input type="radio" name="car_type" value="Minivan" /></label>
                  </div>
                  
                  <label>Transfer price: <input type="text" name="transfer_price" /></label>
                  <label>Discount: <input type="text" name="discount" /></label>

                  <label>Payment type:
                    <select name="payment_method">
                      <option>By cash to driver</option>
                      <option>By card to driver</option>
                      <option>By PayPal</option>
                    </select>
                  </label>

                </div>
                  
                <div className="content-box-cell">

                  <label>Card:
                    <select name="card">
                      <option>MasterCard</option>
                      <option>Visa </option>
                      <option>AmericanExpress</option>
                    </select>
                  </label>  

                  <label>Customer name: <input type="text" name="customer_name" /></label>
                  <label>Customer phone: <input type="tel" name="customer_phone" /></label>
                  <label>Customer email: <input type="email" name="customer_email" /></label>
                  
                  <label>Promo-code: <input type="text" name="promo_code" /></label>
                  <label>Comment: <textarea name="comment" /></label>
                  
                  {this.getMessage()}

                  <div className="btn-wrap">
                    <button type="submit" className="button small">Принять</button>
                    <button type="reset" className="button small">Отмена</button>
                  </div>
                </div>
              </div>
            </div>

            
            
          </form>

        </div>
        
      </div>        
    );
  }
}