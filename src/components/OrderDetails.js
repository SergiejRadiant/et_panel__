import React, { Component } from 'react';
import Modal from 'react-modal'
import spinner from '../assets/images/loading.gif'

export default class OrderDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteOrderModalIsOpen: false
    }
    this.openDeleteOrderModal = this.openDeleteOrderModal.bind(this);
    this.closeDeleteOrderModal = this.closeDeleteOrderModal.bind(this);
    
    let _orderId = this.props.match.params.orderId.slice(1)

    this.props.retrieveOrder(_orderId)
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
        {!this.props.currentOrder.isFetched ? (
          <img className="spinner" src={spinner} />
        ) : (
        <div className="content">
          <div className="contant-label">
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
          {this.props.currentOrder.data.driver ? (
            <p>Driver: {this.props.currentOrder.data.driver}.</p>
          ) : (
            <p>This order has not had a driver yet.</p>
          )}
          <Modal
            isOpen={this.state.deleteOrderModalIsOpen}
            onRequestClose={this.closedeleteOrderModal}
            style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
            className="modal"
            ariaHideApp={false}
          >
            <form>
              <button className="close-btn" onClick={() => this.closedeleteOrderModal()} />
              <p>Вы уверены, что хотите удалить пользователя?</p>
              <div className="btn-wrap">
                <button type="submit" className="button small">
                  Ок
								</button>
                <button type="recet" className="button small" onClick={this.closedeleteOrderModal}>
                  Отмена
								</button>
              </div>
            </form>
          </Modal>
        </div>
        )}
        
      </div>
    );
  }
}
