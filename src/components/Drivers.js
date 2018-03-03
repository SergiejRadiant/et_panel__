import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import '../assets/styles/calendar.css';
import '../assets/styles/picker.css';
import spinner from '../assets/images/loading.gif';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const cn = window.location.search.indexOf('cn') !== -1;

if (cn) {
	moment.locale('zh-cn');
} else {
	moment.locale('en-gb');
}

const now = moment();
if (cn) {
	now.utcOffset(8);
} else {
	now.utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = (
	<TimePickerPanel defaultValue={[ moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss') ]} />
);

function newArray(start, end) {
	const result = [];
	for (let i = start; i < end; i++) {
		result.push(i);
	}
	return result;
}

function disabledDate(current) {
	const date = moment();
	date.hour(0);
	date.minute(0);
	date.second(0);
	return current.isBefore(date); // can not select days before today
}

const formatStr = 'DD.MM.YYYY HH:mm';
function format(v) {
	return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
	return v && v[0] && v[1];
}

function onStandaloneChange(value) {
	console.log('onChange');
	console.log(value[0] && format(value[0]), value[1] && format(value[1]));
}

function onStandaloneSelect(value) {
	console.log('onSelect');
	console.log(format(value[0]), format(value[1]));
}

export default class Drivers extends Component {
	constructor() {
		super();
		this.state = {
			value: [],
			hoverValue: [],
			currentDriver: null,
			deleteDriverModalIsOpen: false
		};
		this.openDeleteDriverModal = this.openDeleteDriverModal.bind(this);
		this.closeDeleteDriverModal = this.closeDeleteDriverModal.bind(this);
	}

	isOnline(d) {
		return d.user.is_authenticated ? (
			<div style={{ color: '#68f2dd' }}>online</div>
		) : d.user.last_login ? (
			`last visit ${d.user.last_login}`
		) : (
			''
		);
	}

	openDeleteDriverModal(driverId) {
		this.setState({ deleteDriverModalIsOpen: true, currentDriver: driverId });
	}

	closeDeleteDriverModal() {
		this.setState({ deleteDriverModalIsOpen: false });
	}

	onChange = (value) => {
		console.log('onChange', value);
		this.setState({ value });
	};

	onHoverChange = (hoverValue) => {
		this.setState({ hoverValue });
	};

	submitDeleteForm() {
		console.log(this.state.currentDriver)
		this.props.deleteDriver(this.state.currentDriver)
		this.closeDeleteDriverModal()
	}

	render() {
		const calendar = (
			<RangeCalendar
				hoverValue={this.state.hoverValue}
				onHoverChange={this.onHoverChange}
				showWeekNumber={false}
				dateInputPlaceholder={[ 'start', 'end' ]}
				defaultValue={[ now, now.clone().add(1, 'months') ]}
				locale={cn ? zhCN : enUS}
				timePicker={timePickerElement}
			/>
		);
		return (
			<div className="content-wrap">
				{!this.props.drivers.isFetched ? (
					<img className="spinner" src={spinner} />
				) : (
					<div className="content">
						<div className="content-label">
							<h1>Водители</h1>
							<Picker
								value={this.state.value}
								onChange={this.onChange}
								animation="slide-up"
								calendar={calendar}
							>
								{({ value }) => {
									return (
										<input
											placeholder="please select"
											disabled={this.state.disabled}
											readOnly
											type="text"
											value={
												(isValidRange(value) && `${format(value[0])} - ${format(value[1])}`) ||
												''
											}
										/>
									);
								}}
							</Picker>
							<Link to="/admin/reg_drv" className="button grey">
								Зарегистрировать
							</Link>
						</div>
						<table className="default-table">
							<thead>
								<tr>
									<td className="normal">Имя</td>
									<td className="normal">Машина</td>
									<td className="normal">В сети (был)</td>
									<td className="small" />
								</tr>
							</thead>
							<tbody>
								{this.props.drivers.data.map((d) => {
									return (
										<tr key={d.id}>
											<td>{`${d.user.first_name} ${d.user.last_name}`}</td>
											<td>{`${d.car}, ${d.number_of_car}`}</td>
											<td>{this.isOnline(d)}</td>
											<td>
												<Link to={`/admin/det_drv:${d.id}`}>Дет.</Link>
												<Link to={`/admin/edit_drv:${d.id}`}>Ред.</Link>
												<span onClick={() => this.openDeleteDriverModal(d.id)}>Удал.</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						<Modal
							isOpen={this.state.deleteDriverModalIsOpen}
							onRequestClose={this.closeDeleteDriverModal}
							style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
							className="modal"
							ariaHideApp={false}
						>
							<button className="close-btn" onClick={() => this.closeDeleteDriverModal()} />
							<p>Вы уверены, что хотите удалить пользователя?</p>
							<div className="btn-wrap">
								<button type="submit" className="button small" onClick={this.submitDeleteForm.bind(this)}>
									Ок
								</button>
								<button type="recet" className="button small" onClick={this.closeDeleteDriverModal}>
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
