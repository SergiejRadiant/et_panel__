import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import * as allConst from '../constants/index'

var serialize = require('form-serialize')


export default class DriverForm extends Component {
  constructor() {
    super() 

    this.state = {
      deleteOrderModalIsOpen: false
    }

    this.openDeleteOrderModal = this.openDeleteOrderModal.bind(this);
    this.closeDeleteOrderModal = this.closeDeleteOrderModal.bind(this);
  } 

  submitOrderForm(e) {
    e.preventDefault()

    let dataObj = serialize(this.orderForm, { hash: true })    

    let orderData = []

    for (let key in dataObj) {
      orderData.push( { name: key , value: dataObj[key] } )
    }

    let newOrder = {
      data: orderData,
      date: null,
      status: allConst.STATUS_NEW,
      driver: null
    }

    this.props.registerOrder(newOrder)
    localStorage.setItem('adminLocation', '/admin/orders')
    this.props.history.push('/')
  }

  openDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: true });
  }

  closeDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: false });
  }

  render() {
    return (
      <div className="content-wrap">
        <div className="content">
          <form ref={(form) => this.orderForm = form} onSubmit={this.submitOrderForm.bind(this)} >
            <div className="content-box">
              <div className="content-box-row">

                <div className="content-box-cell">

                  <label>Откуда: <input type="text" name="From:" /></label>
                  <label>Куда: <input type="text" name="Where" /></label>
                  
                  <label>Дата трансфера: <input type="date" name="Transfer date" /></label>
                  <label>Время трансфера: <input type="time" name="Transfer time" /></label>
                 
                  <div className="radio-wrap">
                    <label>В одну сторону:<input type="radio" name="Transfer Type" value="roundtrip" /></label>
                    <label>Туда и обратно:<input type="radio" name="Transfer Type" value="one way" /></label>
                  </div>

                  <label>Поездка обратно: <input type="date" name="Transfer trip back date" /></label>
                  <label>Время трансфера: <input type="time" name="Transfer trip back time" /></label>

                </div>

                <div className="content-box-cell">
                 
                  <label>Номер рейса: <input type="text" name="Flight number" /></label>
                  <label>Количество взрослых пассажиров: <input type="number" name="Adults passengers" /></label>
                  <label>Количество пассажиров 0-9кг: <input type="number" name="Passengers from 0 to 9 kg" /></label>
                  <label>Количество пассажиров 9-18кг: <input type="number" name="Passengers from 9 to 18 kg" /></label>
                  <label>Количество пассажиров 18-36кг: <input type="number" name="Passengers from 18 to 36 kg" /></label>
                  <div className="radio-wrap">
                    <label>Бизнес-класс:<input type="radio" name="Vehicle type" value="business" /></label>
                    <label>Минивэн:<input type="radio" name="Vehicle type" value="minivan" /></label>
                  </div>
                  <label>Цена:<input type="number" name="Price" /></label>
                </div>
                  
                <div className="content-box-cell">
          
                  <label>Способ оплаты:
                    <select name="Pay method">
                      <option disabled>Select pay method</option>
                      <option>By cash to driver</option>
                      <option>By card to driver</option>
                      <option>By card MasterCard to driver</option>
                      <option>By card Visa to driver</option>
                      <option>By card AmericanExpress to driver</option>
                      <option>By PayPal</option>
                    </select>
                  </label>

                  <label>Заказчик: <input type="text" name="Orderer" /></label>
                  <label>Телефон заказчика: <input type="tel" name="Phone" /></label>
                  <label>E-mail заказчика: <input type="email" name="Email" /></label>
                  
                  <label>Промо: <input type="text" name="Promo" /></label>
                  <label>Комментарий: <textarea name="Comment" /></label>
                  
                </div>
              </div>
            </div>

            <div className="btn-wrap">
              <button type="submit" className="button small">Принять</button>
              <button type="reset" className="button small" onClick={() => this.props.history.goBack()}>Отмена</button>
            </div>
            
          </form>

        </div>
        
      </div>        
    );
  }
}