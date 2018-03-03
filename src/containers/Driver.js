import React, { Component } from 'react'
import { Redirect, Switch, Route, Link } from 'react-router-dom'
import { action as toggleMenu } from 'redux-burger-menu'

import Menu from '../components/Menu'
import Home from '../components/Home'
import DrvOrdersWindow from '../components/DrvOrdersWindow'
import Schedule from '../components/Schedule'
import OrderForm from '../components/OrderForm'

import logo from '../assets/images/logo.svg'
import burgerIcon from '../assets/images/burger-icon.svg'
import exitBtn from '../assets/images/exit.svg'

const drvLinks = [
	{
		name: 'Orders',
		href: '/:driverId/orders'
	},
	{
		name: 'Schedule',
		href: '/:driverId/schedule'
	}
]

export default class Driver extends Component {
	getTitle() {
		let path = this.props.history.location.pathname
		if (~path.indexOf("home")) {
			return "Добро пожаловать"
		} else if (~path.indexOf("drivers")) {
			return "Рабочий график"
		} else if (~path.indexOf("orders")) {
			return "Заказы"
		} else if (~path.indexOf("det_ord")) {
			return "Информация о заказе"
		}
	}

	render() {
		return (
			<div className="page app-page">
				<Menu customBurgerIcon={false} >
					<Link to="/:driverId/home" className="logo" ><img src={logo} alt="Logo" /></Link>
					{drvLinks.map(l => {
						return <Link to={l.href} key={l.href}>{l.name}</Link>
					})}
				</Menu>
				<div className="topbar">
					<div className="container">
						<div className="topbar-content">
							<img className="burger" onClick={() => window.store.dispatch(toggleMenu(true))} src={burgerIcon} />
							<Link to="/admin/home" className="logo" ><img src={logo} alt="Logo" /></Link>
							<ul className="topbar-nav">
								{drvLinks.map(l => {
									return (
										<li key={l.href} className="topbar-nav-item">
											<Link className="topbar-nav-link" to={l.href}>{l.name}</Link>
										</li>
									)
								})}
							</ul>
							<div className="topbar-auth">
								Вы вошли как Username 
								<img src={exitBtn} alt="Выход" className="exit-btn" />
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
							<Route path="/:driverId/home" render={props => <Home {...props} links={drvLinks} />} />

							<Route path="/:driverId/orders" component={DrvOrdersWindow} />

							<Route path="/:driverId/det_ord:orderId" component={OrderForm} />

							<Route path="/:driverId/schedule" component={Schedule} />

							<Redirect from="/:driverId" to=":driverId/home" />
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