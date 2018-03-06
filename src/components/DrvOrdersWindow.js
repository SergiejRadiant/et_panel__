import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import spinner from '../assets/images/loading.gif'
import * as allConst from '../constants/index'

class DrvOrdersWindow extends Component {
	constructor() {
		super();

		this.state = {
			confirmModalIsOpen: false,
			completeModalIsOpen: false
		};

		this.openConfirmModal = this.openConfirmModal.bind(this);
		this.closeConfirmModal = this.closeConfirmModal.bind(this);

		this.openCompleteModal = this.openCompleteModal.bind(this);
		this.closeCompleteModal = this.closeCompleteModal.bind(this);
	}

	newOrders() {
		return this.props.currentDriver.data.orders.filter((ord) => {
			return ord.status === allConst.STATUS_WAIT;
		});
	}

	activeOrders() {
		return this.props.currentDriver.data.orders.filter((ord) => {
			return ord.status === allConst.STATUS_ACTIVE;
		});
	}

	executedOrders() {
		return this.props.currentDriver.data.orders.filter((ord) => {
			return ord.status === allConst.STATUS_EXECUTED;
		});
	}

	checkNewOrders() {
		if (this.newOrders().length)
			return (
				<div className="content-box-cell">
					<div className="content-label">
						<h5>Новые заказы:</h5>
					</div>
					<table className="default-table">
						<thead>
							<tr>
								<td className="xxsmall">Номер:</td>
								<td className="xxsmall">Дата:</td>
								<td className="xxsmall">Статус:</td>
								<td className="xxsmall" />
							</tr>
						</thead>
						<tbody>
							{this.newOrders().map((n) => {
								return (
									<tr key={n.id}>
										<td>{n.id}</td>
										<td>{n.date}</td>
										<td>{n.status}</td>
										<td>
											<span onClick={(orderId) => this.openConfirmModal(n.id)}>Принять</span>
											<Link to={`/driver/det_ord:${n.id}`}>Дет.</Link>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			);
	}

	checkActiveOrders() {
		if (this.activeOrders().length)
			return (
				<div className="content-box-cell">
					<div className="content-label">
						<h5>Активные заказы:</h5>
					</div>
						<table className="default-table">
						<thead>
							<tr>
								<td className="xxsmall">Номер:</td>
								<td className="xxsmall">Дата:</td>
								<td className="xxsmall">Статус:</td>
								<td className="xxsmall" />
							</tr>
						</thead>
						<tbody>
							{this.activeOrders().map((a) => {
								return (
									<tr key={a.id}>
										<td>{a.id}</td>
										<td>{a.date}</td>
										<td>{a.status}</td>
										<td>
											<span onClick={(orderId) => this.openCompleteModal(a.id)}>Заверш.</span>
											<Link to={`/driver/det_ord:${a.id}`}>Дет.</Link>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			);
	}

	checkExecutedOrders() {
		if (this.executedOrders().length)
			return (
				<div className="content-box-cell">
					<div className="content-label">
						<h5>Выполненные заказы:</h5>
					</div>
					<table className="default-table">
						<thead>
							<tr>
								<td className="xxsmall">Номер:</td>
								<td className="xxsmall">Дата:</td>
								<td className="xxsmall">Статус:</td>
								<td className="xxsmall"/>
							</tr>
						</thead>
						<tbody>
							{this.executedOrders().map((e) => {
								return (
									<tr key={e.id}>
										<td>{e.id}</td>
										<td>{e.date}</td>
										<td>{e.status}</td>
										<td>
											<Link to={`/driver/det_ord:${e.id}`}>Детали</Link>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			);
	}

	checkAllOrders() {
    if (!this.executedOrders().length && !this.activeOrders().length && !this.newOrders().length)
      return <div style={{ marginTop: "20px" }}>You have not any orders right now.</div>;
  }

	openConfirmModal(orderId) {
		this.setState({ confirmModalIsOpen: true , currentOrder: orderId });
	}

	closeConfirmModal() {
		this.setState({ confirmModalIsOpen: false, currentOrder: '' });
	}

	openCompleteModal(orderId) {
		this.setState({ completeModalIsOpen: true, currentOrder: orderId });
	}

	closeCompleteModal() {
		this.setState({ completeModalIsOpen: false, currentOrder: '' });
	}

	confirmOrder() {
		let orderId = this.state.currentOrder

		let target = this.props.currentDriver.data.orders.filter( ord => {
			return +ord.id === +orderId
		})
		
		target = target[0]
		
		target.status = allConst.STATUS_ACTIVE
		
		this.props.refreshStatus(target)

		this.closeConfirmModal()

	}
	
	completeOrder() {
		let orderId = this.state.currentOrder

		let target = this.props.currentDriver.data.orders.filter( ord => {
			return +ord.id === +orderId
		})
		
		target = target[0]
		
		target.status = allConst.STATUS_EXECUTED
		
		this.props.refreshStatus(target)

		this.closeConfirmModal()

  }

	render() {
		return (
			<div className="content-wrap">
				{ !this.props.currentDriver.isFetched ? (
          
					<img className="spinner" src={spinner} />
					
					) : (
						<div className="content">
							<div className="content-label">
								<h1>Заказы</h1>
							</div>
							{this.checkAllOrders()}
							<div className="content-box">
								<div className="content-box-row">
									{this.checkNewOrders()}

									{this.checkActiveOrders()}
								</div>

								<div className="content-box-row">{this.checkExecutedOrders()}</div>
							</div>
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
					)
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => { 
	return {
		orders: state.driverOrdersReducer
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		dispatch
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DrvOrdersWindow)
