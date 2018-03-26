import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import '../assets/styles/calendar.css';
import '../assets/styles/picker.css';
import spinner from '../assets/images/loading.gif';

import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const cn = window.location.search.indexOf('cn') !== -1;

if (cn) {
	moment.locale('zh-cn');
} else {
	moment.locale('en-gb');
}

const formatStr = 'DD.MM.YYYY';

function format(v) {
	return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
	return v && v[0] && v[1];
}

export default class Drivers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filteredDrivers: 'none',
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
			`${moment(d.user.last_login).format('DD.MM.YYYY HH:mm')}`
		) : (
			''
		)
	}

	openDeleteDriverModal(driverId) {
		this.setState({ deleteDriverModalIsOpen: true, currentDriver: driverId });
	}

	closeDeleteDriverModal() {
		this.setState({ deleteDriverModalIsOpen: false });
	}

	onChange = (value) => {
		this.setState({ value })
		
		let startDay = value[0],
				endDay = value[1],
				range = moment.range(startDay, endDay),
				drivers = this.props.drivers.data,
				filteredDrivers = []

		for (let drv = 0; drv < drivers.length; drv++) {

			for (let day = 0; day < drivers[drv].work_schedule.workdays.length; day++) {
				
				for (let r of range.by('days')) {

					let workday = moment(drivers[drv].work_schedule.workdays[day].date)
					
					if (moment(workday._d.toDateString()).isSame(r._d.toDateString())) {
						filteredDrivers.push(drivers[drv])
					}
				}
			}
		}

		filteredDrivers = filteredDrivers.filter( (value, index, self) => {
			return self.indexOf(value) === index
		})

		this.setState({ filteredDrivers })
	}
	
	clearDriverFilter() {
		this.setState({ filteredDrivers: 'none', value : [] })
	}

  onHoverChange = (hoverValue) => {
    this.setState({ hoverValue });
	}
	
	submitDeleteForm() {
		this.props.deleteDriver(this.state.currentDriver)

		let updatedData = this.props.drivers.data.filter( ord => {
      return +ord.id !== +this.state.currentDriver
    })

		this.props.drivers.data = updatedData
		
		this.closeDeleteDriverModal()
	}

	getDriverName(driverId) {
		let drivers = this.props.drivers.data,

				current = drivers.filter(d => {
					return +d.id === +driverId
				})

		current = current[0]

		return current.user.first_name || current.user.last_name ?

		`${current.user.first_name} ${current.user.last_name}` :

		current.user.username
		
	}

	render() {
		const calendar = (
      <RangeCalendar
        hoverValue={this.state.hoverValue}
        onHoverChange={this.onHoverChange}
        format={formatStr}
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        locale={cn ? zhCN : enUS}
      />
		)
		
		return (

			<div className="content-wrap">

				{!this.props.drivers.isFetched  ? (

					<img className="spinner" src={spinner} alt="spinner" />
				) : (

					<div className="content">

						<div className="content-label">

							<h1>Drivers</h1>

							<div className="filter-wrap">
								<Picker
										value={this.state.value}
										onChange={this.onChange}
										animation="slide-up"
										calendar={calendar}
									>
										{
											({ value }) => {
												return (
													<input
														placeholder="Select days"
														readOnly
														type="text"
														ref={input => this.selectDays = input}
														value={( isValidRange(value) && `${format(value[0])} - ${format(value[1])}` ) || ''}
													/>
												);
											}
										}
								</Picker>

								<div className="input-close-btn" onClick={(e) => this.clearDriverFilter(e)}></div>

							</div>

							<Link to="/admin/reg_drv" className="button grey">New driver</Link>
						</div>

						<table className="default-table">

							<thead>
								<tr>
									<td className="normal">Name</td>
									<td className="normal">Car</td>
									<td className="normal">Last visit</td>
									<td className="small" />
								</tr>
							</thead>
							
							<tbody>
								{ this.state.filteredDrivers !== 'none' ? (
									
									this.state.filteredDrivers.map((d) => {
										
										return (
											<tr key={d.id}>
												<td>{this.getDriverName(d.id)}</td>
												<td>{`${d.car}, ${d.number_of_car}`}</td>
												<td>{this.isOnline(d)}</td>
												<td>
													<Link to={`/admin/det_drv:${d.id}`}>Det.</Link>
													<Link to={`/admin/edit_drv:${d.id}`}>Edit</Link>
													<span onClick={() => this.openDeleteDriverModal(d.id)}>Del.</span>
												</td>
											</tr>
										)
									})
								) : (
									this.props.drivers.data.map((d) => {

										return (
											<tr key={d.id}>
												<td>{this.getDriverName(d.id)}</td>
												<td>{`${d.car}, ${d.number_of_car}`}</td>
												<td>{this.isOnline(d)}</td>
												<td>
													<Link to={`/admin/det_drv:${d.id}`}>Det.</Link>
													<Link to={`/admin/edit_drv:${d.id}`}>Edit</Link>
													<span onClick={() => this.openDeleteDriverModal(d.id)}>Del.</span>
												</td>
											</tr>
										)
									})
								)}
								
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
