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

    let _orderId = this.props.match.params.orderId.slice(1)
    this.props.retrieveOrder(_orderId)
  }

  componentDidUpdate() {
    if (this.orderForm && this.props.currentOrder.isFetched) {

      let current = this.props.currentOrder.data,
          inputs = this.orderForm.getElementsByTagName('input')

      for (let i of inputs) {
        let target = current.data.filter(c => {
          return i.name === c.name
        })

        target = target[0]

        i.value = target.value
      }

    }      
  }

  submitOrderForm(e) {
    e.preventDefault()

    let dataObj = this.orderForm.getElementsByTagName('input'),
        target = this.props.currentOrder.data,
        orderData = []

    for (let input of dataObj) {
      orderData.push( { name: input.name , value: input.value } )
    }

    target.data = orderData
    target.status = this.setStatusSelect.value
    target.driver = this.setDriverSelect.value

    console.log(orderData)

    this.props.editOrder(target)

    let targetInList = this.props.orders.data.filter( ord => {
      return +ord.id === +target.id
    })
      
    targetInList = targetInList[0]
    
    targetInList.data = orderData
    targetInList.status = this.setStatusSelect.value
    targetInList.driver = this.setDriverSelect.value
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
                <h1 style={{ fontSize: "25px" }}>Order #{this.props.currentOrder.data.id}</h1>
              </div>

              <div className="content-label">
                <h5>Информация о заказе:</h5>
              </div>

              <table className="default-table vertical">
                <tbody>
                  {this.props.currentOrder.data.data.map( d => {
                    return (
                      <tr key={d.value}>
                        <td>{d.name}</td>
                        <td><input type="text" name={d.name}/></td>
                      </tr>
                    )
                  })}
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
                          <option value={d.id}>{`${d.user.first_name} ${d.user.last_name}`}</option>
                        )
                      }
                    })}

                    {this.props.drivers.data.map(d => {
                      
                      let current = this.props.currentOrder.data

                      if ( current.driver && d.id !== current.driver ) {
                        return (
                          <option key={d.id} value={d.id}>{`${d.user.first_name} ${d.user.last_name}`}</option>
                        )
                      }

                      if ( !current.driver  ) {
                        return (
                          <option key={d.id} value={d.id}>{`${d.user.first_name} ${d.user.last_name}`}</option>
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
                <button type="reset" className="button small">Cancel</button>
              </div>

            </form>
          </div>

        )}

      </div>        
    );
  }
}