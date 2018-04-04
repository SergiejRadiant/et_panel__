import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal'
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import '../assets/styles/calendar.css';
import '../assets/styles/picker.css';
import spinner from '../assets/images/loading.gif'
import * as allConst from '../constants/index'

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

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

export default class AdmOrdersWindow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filteredDrivers: [],
      filteredOrders: 'none',
      value: [],
      hoverValue: [],
      deleteOrderModalIsOpen: false,
      currentOrder: null,
      getDriverModalIsOpen: false,
    }

    this.openDeleteOrderModal = this.openDeleteOrderModal.bind(this)
    this.closeDeleteOrderModal = this.closeDeleteOrderModal.bind(this)
    this.openGetDriverModal = this.openGetDriverModal.bind(this)
    this.closeGetDriverModal = this.closeGetDriverModal.bind(this)
  }

  newOrders() {
    return this.props.orders.data.filter(ord => {
      return ord.status === allConst.STATUS_NEW || ord.status === allConst.STATUS_WAIT;
    });
  }

  activeOrders() {
    return this.props.orders.data.filter(ord => {
      return ord.status === allConst.STATUS_ACTIVE;
    });
  }

  executedOrders() {
    return this.props.orders.data.filter(ord => {
      return ord.status === allConst.STATUS_EXECUTED;
    });
  }

  getDriverName(driverId) {
    let current = this.props.drivers.data.filter(drv => {
      return +drv.id === +driverId
    })

    current = current[0]

    return current.user.first_name || current.user.last_name ?

		`${current.user.first_name} ${current.user.last_name}` :

		current.user.username
  }

  checkNewOrders() {
    if (this.newOrders().length)
      return (
        <div className="content-box-cell">
          <div className="content-label">
						<h5>New orders:</h5>
					</div>
          <table className="default-table" style={{ boxShadow: '0 0 3px #68f2dd' }}>
            <thead>
              <tr>
                <td className="xxsmall">Number:</td>
                <td className="xsmall">Date:</td>
                <td className="xsmall">Status:</td>
                <td className="xsmall">Driver:</td>
                <td className="xsmall" />
              </tr>
            </thead>
            <tbody>
              {this.newOrders().map((n) => {
                return (
                  <tr key={n.id}>
                    <td>{n.id}</td>
                    <td>{moment(n.date).format(formatStr)}</td>
                    <td>{n.status}</td>
                    <td>
                      {n.driver ? (
                        <Link to={`/admin/det_drv:${n.driver}`}>{this.getDriverName(n.driver)}</Link>
                      ) : (
                        <span onClick={() => this.openGetDriverModal(n.id)}>Set driver</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/admin/det_ord:${n.id}`}>Det.</Link>
                      <Link to={`/admin/edit_ord:${n.id}`}>Edit</Link>
                      <span onClick={() => this.openDeleteOrderModal(n.id)}>Del.</span>
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
					  <h5>Active orders:</h5>
					</div>
          <table className="default-table">
            <thead>
              <tr>
                <td className="xxsmall">Number:</td>
                <td className="xsmall">Date:</td>
                <td className="xsmall">Status:</td>
                <td className="xsmall">Driver:</td>
                <td className="xsmall" />
               </tr>
            </thead>
            <tbody>
              {this.activeOrders().map((a) => {
                return (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{moment(a.date).format(formatStr)}</td>
                    <td>{a.status}</td>
                    <td>
                      <Link to={`/admin/det_drv:${a.driver}`}>{this.getDriverName(a.driver)}</Link></td>
                    <td>
                      <Link to={`/admin/det_ord:${a.id}`}>Det.</Link>
                      <Link to={`/admin/edit_ord:${a.id}`}>Edit</Link>
                      <span onClick={() => this.openDeleteOrderModal(a.id)}>Del.</span>
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
						<h5>Completed orders:</h5>
					</div>
          <table className="default-table">
            <thead>
              <tr>
                <td className="xxsmall">Number:</td>
                <td className="xsmall">Date:</td>
                <td className="xsmall">Status:</td>
                <td className="xsmall">Driver:</td>
                <td className="xsmall" />
              </tr>
            </thead>
            <tbody>
              {this.executedOrders().map((e) => {
                return (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{moment(e.date).format(formatStr)}</td>
                    <td>{e.status}</td>
                    <td>
                      <Link to={`/admin/det_drv:${e.driver}`}>{this.getDriverName(e.driver)}</Link></td>
                    <td>
                      <Link to={`/admin/det_ord:${e.id}`}>Det.</Link>
                      <Link to={`/admin/edit_ord:${e.id}`}>Edit</Link>
                      <span onClick={(orderId) => this.openDeleteOrderModal(e.id)}>Del.</span>
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

  openDeleteOrderModal(orderId) {
    this.setState({ deleteOrderModalIsOpen: true, currentOrder: orderId });
  }

  closeDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: false, currentOrder: '' });
  }

  openGetDriverModal(orderId) {
    this.setState({ getDriverModalIsOpen: true , currentOrder: orderId });
  }

  closeGetDriverModal() {
    this.setState({ getDriverModalIsOpen: false, currentOrder: '',  filteredDrivers: [], value: [] });
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
  
  onOrderFilterChange() {
  	let value = this.selectOrderId.value.toString(),
				filteredOrders = this.props.orders.data

		filteredOrders = filteredOrders.filter( ord => {
			return ~ord.id.toString().indexOf(value)
		})

		this.setState({ filteredOrders })
	}
	
	clearDriverFilter() {
		this.setState({ filteredDrivers: [], value : [] })
  }
  
  clearOrderFilter() {
    this.selectOrderId.value = ''
		this.setState({ filteredOrders: 'none' })
	}

  onHoverChange = (hoverValue) => {
    this.setState({ hoverValue });
  }

  setDriver() {
    let orderId = this.state.currentOrder,
        driverId = this.setDriverSelect.value

    if (driverId) {
      let target = this.props.orders.data.filter( ord => {
        return +ord.id === +orderId
      })
      
      target = target[0]
      target.driver = driverId
      target.status = allConst.STATUS_WAIT
      this.props.setDriver(target)

      this.closeGetDriverModal()
    }
  }

  submitDeleteForm() {
    this.props.deleteOrder(this.state.currentOrder)
    
    let updatedData = this.props.orders.data.filter( ord => {
      return +ord.id !== +this.state.currentOrder
    })

    this.props.orders.data = updatedData

    this.closeDeleteOrderModal()
  }

  render() {
    const calendar = (
      <RangeCalendar
        hoverValue={this.state.hoverValue}
        onHoverChange={this.onHoverChange}
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        locale={cn ? zhCN : enUS}
      />
    )
    
    return (

      <div className="content-wrap">

        {!this.props.orders.isFetched || !this.props.drivers.isFetched ? (

          <img className="spinner" src={spinner} alt="spinner" />

        ) : (

          <div className="content">

            <div className="content-label">

              <h1>Orders</h1>

              <div className="filter-wrap">

                <input
                  placeholder="Select order ID"
                  type="text"
                  ref={input => this.selectOrderId = input}
                  onChange={() => this.onOrderFilterChange()}
                />

								<div className="input-close-btn" onClick={() => this.clearOrderFilter()}></div>
  						</div>

              <Link to='/admin/reg_ord' className="button grey">New order</Link>
            </div>

            { this.state.filteredOrders !== 'none' ? (
             
              <div className="content-box">
                <div className="content-box-row">
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
                          <td className="xxsmall">Водитель</td>
                          <td className="xxsmall" />
                        </tr>
                      </thead>

                      <tbody>

                        {this.state.filteredOrders.map((f) => {

                          return (

                            <tr key={f.id}>
                              <td>{f.id}</td>
                              <td>{f.date}</td>
                              <td>{f.status}</td>
                              <td>
                                {f.driver ? (
                                  this.getDriverName(f.driver)
                                ) : (
                                  <span onClick={() => this.openGetDriverModal(f.id)}>Назначить</span>
                                )}
                              </td>
                                
                              <td>
                                <Link to={`/admin/det_ord:${f.id}`}>Дет.</Link>
                                <Link to={`/admin/edit_ord:${f.id}`}>Ред.</Link>
                                <span onClick={(orderId) => this.openDeleteOrderModal(f.id)}>Удал.</span>
                              </td>
                            </tr>

                          )

                        })}

                      </tbody>

                    </table>

                  </div>
                </div>
              </div>


            ) : (

              <div className="content-box">
                <div className="content-box-row">

                  {this.checkAllOrders()}
                  {this.checkNewOrders()}
                  {this.checkActiveOrders()}

                </div>
                <div className="content-box-row">

                  {this.checkExecutedOrders()}

                </div>
              </div>

            ) }

            <Modal
              isOpen={this.state.deleteOrderModalIsOpen}
              onRequestClose={this.closeDeleteOrderModal}
              style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
              className="modal"
              ariaHideApp={false}
            >
              <button type="reset" className="close-btn" onClick={() => this.closeDeleteOrderModal()} />
              <p>Вы уверены, что хотите удалить заказ?</p>
              <div className="btn-wrap">
                <button type="submit" className="button small" onClick={this.submitDeleteForm.bind(this)}>
                  Ок
                </button>
                <button type="recet" className="button small" onClick={this.closeDeleteOrderModal}>
                  Отмена
                </button>
              </div>
            </Modal> 

            <Modal
              isOpen={this.state.getDriverModalIsOpen}
              onRequestClose={this.closeDetDriverModal}
              style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
              className="modal"
              ariaHideApp={false}
            >
              <button type="reset" className="close-btn" onClick={this.closeGetDriverModal} />
              <h5>Выберите дату: </h5> 
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
                <div className="input-close-btn" onClick={() => this.clearDriverFilter()}></div>
              </div>

              <label>Водители:
                <select ref={ select => this.setDriverSelect = select} size="6" style={{ height: "125px" }}>

                  {this.state.filteredDrivers.map((f) => {
                    return <option key={f.id} value={f.id}>{this.getDriverName(f.id)}</option>
                  })}

                </select>
              </label>

              <div className="btn-wrap">
                <button type="submit" className="button small" onClick={this.setDriver.bind(this)}>Принять</button>
                <button type="reset" className="button small" onClick={this.closeGetDriverModal}>Отмена</button>
              </div>

            </Modal>  

          </div>

        )}

      </div>
    );
  }
}

