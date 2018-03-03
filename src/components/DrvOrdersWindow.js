import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';

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
		return this.props.orders.filter((ord) => {
			return ord.status === 'wait';
		});
	}

	activeOrders() {
		return this.props.orders.filter((ord) => {
			return ord.status === 'process';
		});
	}

	executedOrders() {
		return this.props.orders.filter((ord) => {
			return ord.status === 'done';
		});
	}

	getStatus(status) {
		return status === 'wait' ? 'new' : status;
	}

	checkNewOrders() {
		if (this.newOrders().length)
			return (
				<div className="content-box-cell">
					<h5>Новые заказы:</h5>
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
										<td>{n.id.slice(-6)}</td>
										<td>{n.date}</td>
										<td>{this.getStatus(n.status)}</td>
										<td>
											<span onClick={this.openConfirmModal}>Принять</span>
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
					<h5>Активные заказы:</h5>
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
										<td>{a.id.slice(-6)}</td>
										<td>{a.date}</td>
										<td>{this.getStatus(a.status)}</td>
										<td>
											<span onClick={this.openCompleteModal}>Заверш.</span>
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
					<h5>Выполненные заказы:</h5>
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
									<tr key={e.id.slice(-6)}>
										<td>{e.id}</td>
										<td>{e.date}</td>
										<td>{this.getStatus(e.status)}</td>
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
			return <p>You have not any orders right now.</p>;
	}

	openConfirmModal() {
		this.setState({ confirmModalIsOpen: true });
	}

	closeConfirmModal() {
		this.setState({ confirmModalIsOpen: false });
	}

	openCompleteModal() {
		this.setState({ completeModalIsOpen: true });
	}

	closeCompleteModal() {
		this.setState({ completeModalIsOpen: false });
	}

	render() {
		return (
			<div className="content-wrap">
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
						<form>
							<button className="close-btn" onClick={this.closeConfirmModal} />
							<p>Подтвердить заказ?</p>
							<div className="btn-wrap">
								<button type="submit" className="button small">
									Ок
								</button>
								<button type="recet" className="button small" onClick={this.closeConfirmModal}>
									Отмена
								</button>
							</div>
						</form>
					</Modal>
					<Modal
						isOpen={this.state.completeModalIsOpen}
						onRequestClose={this.closeCompleteModal}
						style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
						className="modal"
						ariaHideApp={false}
					>
						<form>
							<button className="close-btn" onClick={this.closeCompleteModal} />
							<p>Завершить заказ?</p>
							<div className="btn-wrap">
								<button type="submit" className="button small">
									Ок
								</button>
								<button type="recet" className="button small" onClick={this.closeCompleteModal}>
									Отмена
								</button>
							</div>
						</form>
					</Modal>
				</div>
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
