import React, { Component } from 'react'
import { Redirect, Switch, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { action as toggleMenu } from 'redux-burger-menu'

import Menu from '../components/Menu'
import Home from '../components/Home'
import Drivers from '../components/Drivers'
import AdmOrdersWindow from '../components/AdmOrdersWindow'
import DriverForm from '../components/DriverForm'
import OrderForm from '../components/OrderForm'
import AdmOrderDetails from '../components/AdmOrderDetails'
import DriverDetails from '../components/DriverDetails'

import logo from '../assets/images/logo.svg'
import burgerIcon from '../assets/images/burger-icon.svg'
import exitBtn from '../assets/images/exit.svg'

import { 
	retrieveDrivers,
	retrieveDriver,
	registerDriver, 
	retrieveOrders, 
	retrieveOrder, 
	registerOrder, 
	deleteDriver,
	deleteOrder, 
	setDriver,
	editDriver,
	editOrder
} from '../actions/index'

import { isAuthenticated } from '../reducers/index'
import * as allConst from '../constants/index'

const admLinks =  [
	{
		name: 'Drivers',
		href: '/admin/drivers'
	},
	{
		name: 'Orders',
		href: '/admin/orders'
	}
]

class Admin extends Component {
	constructor(props) {
		super(props) 
		
		this.props.retrieveDrivers()
		this.props.retrieveOrders()
	}
	
	componentDidMount() {
		!localStorage.getItem('adminLocation') ? this.props.history.push('/admin/home') : this.props.history.push(localStorage.getItem('adminLocation'))
	}

	componentWillReceiveProps() {
		if (this.props.history.location.pathname !== '/' && this.props.history.location.pathname !== '/admin' && this.props.history.location.pathname !== '/admin/home')
			localStorage.setItem('adminLocation', this.props.history.location.pathname)
	}

	logout() {
		localStorage.clear('ersist:poll')
		window.location = '/'
	}
	
	getTitle() {
		let path = this.props.history.location.pathname
		if (~path.indexOf("home")) {
			return "Добро пожаловать"
		} else if (~path.indexOf("drivers")) {
			return "Водители"
		} else if (~path.indexOf("reg_drv")) {
			return "Новый водитель"
		} else if (~path.indexOf("det_drv")) {
			return "Информация о водителе"
		} else if (~path.indexOf("edit_drv")) {
			return "Редактировать пользователя"
		} else if (~path.indexOf("orders")) {
			return "Заказы"
		} else if (~path.indexOf("reg_ord")) {
			return "Новый заказ"
		} else if (~path.indexOf("det_ord")) {
			return "Информация о заказе"
		}
	}
	
	setCounter() {
		if (this.props.orders.isFetched) {

			let newOrders = this.props.orders.data.filter( ord => {
				return ord.status === allConst.STATUS_NEW || ord.status === allConst.STATUS_WAIT
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
					<Link to="/admin/home" className="logo" ><img src={logo} alt="Logo" /></Link>
					<Link to='/admin/orders'>Orders{this.setCounter()}</Link>
					<Link to='/admin/drivers'>Drivers</Link>
				</Menu>
				<div className="topbar">
					<div className="container">
						<div className="topbar-content">
							<span className="burger"><img onClick={() => window.store.dispatch(toggleMenu(true))} src={burgerIcon} />{this.setCounter()}</span>
							<Link to="/admin/home"  className="logo" ><img src={logo} alt="Logo" /></Link>
							<ul className="topbar-nav">
								<li className="topbar-nav-item">
									<Link className="topbar-nav-link" to='/admin/orders'>Orders{this.setCounter()}</Link>
								</li>
								<li className="topbar-nav-item">
									<Link className="topbar-nav-link" to='/admin/drivers'>Drivers</Link>
								</li>
							</ul>
							<div className="topbar-auth">
								Вы вошли как Admin
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
							<Route path="/admin/home" render={ props => <Home {...props} links={admLinks}/> } />

							<Route path="/admin/drivers" render={ props => <Drivers {...props} deleteDriver={this.props.deleteDriver} drivers={this.props.drivers} /> } />
					
							<Route path="/admin/reg_drv" render={ props => <DriverForm {...props} registerDriver={this.props.registerDriver} /> } />
					
							<Route path="/admin/det_drv:driverId" render={props => <DriverDetails {...props} deleteOrder={this.props.deleteOrder} deleteDriver={this.props.deleteDriver} retrieveDriver={this.props.retrieveDriver} drivers={this.props.drivers} currentDriver={this.props.currentDriver} /> } />

							<Route path="/admin/edit_drv:driverId" render={ props => <DriverForm {...props} editDriver={this.props.editDriver} retrieveDriver={this.props.retrieveDriver} currentDriver={this.props.currentDriver} /> } />
					
							<Route path="/admin/orders" render={ props => <AdmOrdersWindow {...props} setDriver={this.props.setDriver} editOrder={this.props.editOrder} deleteOrder={this.props.deleteOrder} drivers={this.props.drivers} orders={this.props.orders} /> } />
					
							<Route path="/admin/reg_ord" render={ props => <OrderForm {...props}  registerOrder={this.props.registerOrder} /> } />
					
							<Route path="/admin/det_ord:orderId" render={ props => <AdmOrderDetails {...props} setDriver={this.props.setDriver} editOrder={this.props.editOrder} retrieveOrder={this.props.retrieveOrder} retrieveOrders={this.props.retrieveOrders} currentOrder={this.props.currentOrder} deleteOrder={this.props.deleteOrder} drivers={this.props.drivers} orders={this.props.orders} /> } />
							
							{localStorage.getItem('adminLocation') ? (
								<Redirect to={localStorage.getItem('adminLocation')}/>
							) : (
								<Redirect to="admin/home"/>
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
		drivers: state.retrieveDriversReducer,
		orders: state.retrieveOrdersReducer,
		currentOrder: state.retrieveOrderReducer,
		currentDriver: state.retrieveDriverReducer,
		editDriver: state.editDriverReducer,
		editOrder: state.editOrderReducer
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		retrieveDrivers: bindActionCreators(retrieveDrivers, dispatch),
		retrieveDriver: bindActionCreators(retrieveDriver, dispatch),
		registerDriver: bindActionCreators(registerDriver, dispatch),
		deleteDriver: bindActionCreators(deleteDriver, dispatch),
		retrieveOrders: bindActionCreators(retrieveOrders, dispatch),
		registerOrder: bindActionCreators(registerOrder, dispatch),
		retrieveOrder: bindActionCreators(retrieveOrder, dispatch),
		deleteOrder: bindActionCreators(deleteOrder, dispatch),
		setDriver: bindActionCreators(setDriver, dispatch),
		editDriver: bindActionCreators(editDriver, dispatch),
		editOrder: bindActionCreators(editOrder, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)

