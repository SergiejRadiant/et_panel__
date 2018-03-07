import React, { Component } from 'react'
import { Redirect, Switch, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { action as toggleMenu } from 'redux-burger-menu'

import Menu from '../components/Menu'
import Home from '../components/Home'
import DrvOrdersWindow from '../components/DrvOrdersWindow'
import Schedule from '../components/Schedule'
import DrvOrderDetails from '../components/DrvOrderDetails'

import logo from '../assets/images/logo.svg'
import burgerIcon from '../assets/images/burger-icon.svg'
import exitBtn from '../assets/images/exit.svg'

import { isAuthenticated } from '../reducers/index'
import { retrieveDriver, retrieveOrder, setSchedule, editOrder } from '../actions/index'

import * as allConst from '../constants/index'

const drvLinks = [
	{
		name: 'Orders',
		href: '/driver/orders'
	},
	{
		name: 'Schedule',
		href: '/driver/schedule'
	}
]

class Driver extends Component {
	constructor(props) {
		super(props)
		
		let driverId = this.props.auth.user.id
		this.props.retrieveDriver(driverId)
	}

	componentDidMount() {
		!localStorage.getItem('driverLocation') ? this.props.history.push('/driver/home') : this.props.history.push(localStorage.getItem('driverLocation'))
	}

	componentWillReceiveProps() {
		if (this.props.history.location.pathname !== '/' && this.props.history.location.pathname !== '/driver' && this.props.history.location.pathname !== '/driver/home')
			localStorage.setItem('driverLocation', this.props.history.location.pathname)
	}

	getUsername() {
		let username = this.props.auth.user.user.username

		return `${username[0].toUpperCase()}${username.slice(1)}`
	}

	logout() {
		localStorage.clear('ersist:poll')
		window.location = '/'
	}

	getTitle() {
		let path = this.props.history.location.pathname
		if (~path.indexOf("home")) {
			return "Добро пожаловать"
		} else if (~path.indexOf("schedule")) {
			return "Рабочий график"
		} else if (~path.indexOf("orders")) {
			return "Заказы"
		} else if (~path.indexOf("det_ord")) {
			return "Информация о заказе"
		}
	}

	setCounter() {
		if (this.props.currentDriver.isFetched) {

			let newOrders = this.props.currentDriver.data.orders.filter( ord => {
				return ord.status === allConst.STATUS_WAIT
			})

			return newOrders.length > 0 ? 

			<span className="nav-link-counter">{newOrders.length}</span> :

			null

		}
	}

	render() {
		return (
			<div className="page app-page">
				<Menu customBurgerIcon={false} >
					<Link to="/driver/home" className="logo" ><img src={logo} alt="Logo" /></Link>
					<Link to='/driver/orders'>Orders{this.setCounter()}</Link>
					<Link to='/driver/schedule'>Schedule</Link>
				</Menu>
				<div className="topbar">
					<div className="container">
						<div className="topbar-content">
							<span className="burger"><img onClick={() => window.store.dispatch(toggleMenu(true))} src={burgerIcon} />{this.setCounter()}</span>
							<Link to="/driver/home" className="logo" ><img src={logo} alt="Logo" /></Link>
							<ul className="topbar-nav">
								<li className="topbar-nav-item">
									<Link className="topbar-nav-link" to='/driver/orders'>Orders{this.setCounter()}</Link>
								</li>
								<li className="topbar-nav-item">
									<Link className="topbar-nav-link" to='/driver/schedule'>Schedule</Link>
								</li>
							</ul>
							<div className="topbar-auth">
								Вы вошли как {this.getUsername()}
								<img src={exitBtn} alt="Выход" className="exit-btn" onClick={() => this.logout()}/>
							</div>
						</div>
					</div>
				</div>

				<div className="main">
					<div className="container">

						<div className="content-topbar">
							<a className="back-btn" onClick={() => this.props.history.goBack()}>&#8249; Назад</a>
							<h2>{this.getTitle()}</h2>
						</div>

						<Switch>
							<Route path="/driver/home" render={props => <Home {...props} links={drvLinks} />} />

							<Route path="/driver/orders" render={ props => <DrvOrdersWindow {...props} editOrder={this.props.editOrder} currentDriver={this.props.currentDriver} /> } />

							<Route path="/driver/det_ord:orderId" render={ props => <DrvOrderDetails {...props} editOrder={this.props.editOrder} retrieveOrder={this.props.retrieveOrder} currentDriver={this.props.currentDriver} currentOrder={this.props.currentOrder} /> } />

							<Route path="/driver/schedule" render={ props => <Schedule {...props} setSchedule={this.props.setSchedule} retrieveDriver={this.props.retrieveDriver} currentDriver={this.props.currentDriver} /> } />

							{localStorage.getItem('driverLocation') ? (
								<Redirect to={localStorage.getItem('driverLocation')}/>
							) : (
								<Redirect to="/driver/home"/>
							)}
						</Switch>

					</div>
				</div>

				<div className="footer">
					<div className="container">
						Developed by <a href="radiant-graphics.ru">Radiant Graphics</a>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		auth: isAuthenticated(state),
		currentDriver: state.retrieveDriverReducer,
		currentOrder: state.retrieveOrderReducer,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		retrieveDriver: bindActionCreators(retrieveDriver, dispatch),
		retrieveOrder: bindActionCreators(retrieveOrder, dispatch),
		setSchedule: bindActionCreators(setSchedule, dispatch),
		editOrder: bindActionCreators(editOrder, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Driver)