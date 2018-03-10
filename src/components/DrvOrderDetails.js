import React, { Component } from 'react'
import Modal from 'react-modal'
import spinner from '../assets/images/loading.gif'
import * as allConst from '../constants/index'


export default class OrderDetails extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      confirmModalIsOpen: false,
			completeModalIsOpen: false,
    }
    
    this.openConfirmModal = this.openConfirmModal.bind(this)
		this.closeConfirmModal = this.closeConfirmModal.bind(this)
		this.openCompleteModal = this.openCompleteModal.bind(this)
		this.closeCompleteModal = this.closeCompleteModal.bind(this)
    
    let _orderId = this.props.match.params.orderId.slice(1)

    this.props.retrieveOrder(_orderId)
  }

  openConfirmModal(orderId) {
		this.setState({ confirmModalIsOpen: true  });
	}

	closeConfirmModal() {
		this.setState({ confirmModalIsOpen: false });
	}

	openCompleteModal(orderId) {
		this.setState({ completeModalIsOpen: true });
	}

	closeCompleteModal() {
		this.setState({ completeModalIsOpen: false });
	}

	confirmOrder() {
		let target = this.props.currentOrder.data
		
		target.status = allConst.STATUS_ACTIVE
		
    this.props.editOrder(target)
    
    let targetInList = this.props.currentDriver.data.orders.filter( ord => {
      return +ord.id === +this.props.currentOrder.data.id
    })
      
    targetInList = targetInList[0]
    
    targetInList.status = allConst.STATUS_ACTIVE

		this.closeConfirmModal()
	}
	
	completeOrder() {
		let target = this.props.currentOrder.data
		
		target.status = allConst.STATUS_EXECUTED
		
    this.props.editOrder(target)
    
    let targetInList = this.props.currentDriver.data.orders.filter( ord => {
      return +ord.id === +target.id
    })
      
    targetInList = targetInList[0]

    targetInList.status = allConst.STATUS_EXECUTED

		this.closeCompleteModal()
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
                  <button className="button small left" onClick={() => this.openConfirmModal()}>Подтв.</button>
                </div>
              ) : this.props.currentOrder.data.status === allConst.STATUS_ACTIVE ? (
                <div className="btn-wrap">
                  <button className="button small left" onClick={() => this.openCompleteModal()}>Заверш.</button>
                </div>
              ) : null
            }

            <Modal
              isOpen={this.state.confirmModalIsOpen}
              onRequestClose={this.closeConfirmModal}
              style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
              className="modal"
              ariaHideApp={false}
            >
              <button className="close-btn" onClick={this.closeConfirmModal.bind(this)} />
              <p>Подтвердить заказ?</p>
              <div className="btn-wrap">
                <button className="button small" onClick={this.confirmOrder.bind(this)}>
                  Ок
                </button>
                <button className="button small" onClick={this.closeConfirmModal.bind(this)}>
                  Отмена
                </button>
              </div>
            </Modal>

            <Modal
              isOpen={this.state.completeModalIsOpen}
              onRequestClose={this.closeCompleteModal}
              style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
              className="modal"
              ariaHideApp={false}
            >
              <button className="close-btn" onClick={this.closeCompleteModal.bind(this)} />
              <p>Завершить заказ?</p>
              <div className="btn-wrap">
                <button className="button small" onClick={this.completeOrder.bind(this)}>
                  Ок
                </button>
                <button className="button small" onClick={this.closeCompleteModal.bind(this)}>
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
