import React, { Component } from 'react'
import Modal from 'react-modal'
import spinner from '../assets/images/loading.gif'
import * as allConst from '../constants/index'


export default class OrderDetails extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      deleteOrderModalIsOpen: false,
    }
    
    this.openDeleteOrderModal = this.openDeleteOrderModal.bind(this)
    this.closeDeleteOrderModal = this.closeDeleteOrderModal.bind(this)
    
    let _orderId = this.props.match.params.orderId.slice(1)

    this.props.retrieveOrder(_orderId)
  }

  openDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: true });
  }

  closeDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: false });
  }

  submitDeleteForm() {
    this.props.deleteOrder(this.props.currentOrder.data.id)

    let updatedData = this.props.orders.data.filter( ord => {
      return ord.id != this.props.currentOrder.data.id
    })

    this.props.orders.data = updatedData

    this.closeDeleteOrderModal()

  }

  render() {
    return (
      <div className="content-wrap">
        {!this.props.currentOrder.isFetched ? (
          <img className="spinner" src={spinner} />
        ) : (
        <div className="content">

          <div className="content-label">
            <h1 style={{ fontSize: "25px"}}>Order #{this.props.currentOrder.data.id}</h1>
          </div>
          
          <div className="content-label">
            <h5>Информация о заказе:</h5>
          </div>

          <table className="default-table vertical">
            <tbody>
              {this.props.currentOrder.data.data.map( d => {
                return (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.value}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="table-footer">
            <div><h5>Date of creation:</h5> {this.props.currentOrder.data.date}</div>
            <div><h5>Status:</h5> {this.props.currentOrder.data.status}</div>
          </div>

          {
            this.props.currentOrder.data.status === allConst.STATUS_WAIT ? (
              <div className="btn-wrap">
                <button className="button small left" >Подтв.</button>
              </div>
            ) : this.props.currentOrder.data.status === allConst.STATUS_ACTIVE ? (
              <div className="btn-wrap">
                <button className="button small left" >Заверш.</button>
              </div>
            ) : null
          }

          <Modal
            isOpen={this.state.deleteOrderModalIsOpen}
            onRequestClose={this.closeDeleteOrderModal}
            style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
            className="modal"
            ariaHideApp={false}
          >
            <button className="close-btn" onClick={() => this.closedeleteOrderModal()} />
            <p>Вы уверены, что хотите удалить заказ?</p>
            <div className="btn-wrap">
              <button className="button small" onClick={this.submitDeleteForm.bind(this)}>
                Ок
              </button>
              <button className="button small" onClick={this.closeDeleteOrderModal}>
                Отмена
              </button>
            </div>
          </Modal>
        </div>
        )}
        
      </div>
    );
  }
}
