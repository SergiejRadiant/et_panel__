import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import spinner from '../assets/images/loading.gif'
import Picker from 'rc-calendar/lib/Picker'
import RangeCalendar from 'rc-calendar/lib/RangeCalendar'
import zhCN from 'rc-calendar/lib/locale/zh_CN'
import enUS from 'rc-calendar/lib/locale/en_US'
import '../assets/styles/calendar.css'
import '../assets/styles/picker.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'moment/locale/en-gb'
import * as allConst from '../constants/index'

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

export default class OrderDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredDrivers: [],
      value: [],
      hoverValue: [],
      getDriverModalIsOpen: false,
      deleteOrderModalIsOpen: false
    }
    this.openGetDriverModal = this.openGetDriverModal.bind(this)
    this.closeGetDriverModal = this.closeGetDriverModal.bind(this)
    this.openDeleteOrderModal = this.openDeleteOrderModal.bind(this)
    this.closeDeleteOrderModal = this.closeDeleteOrderModal.bind(this)

    let orderId = this.props.match.params.orderId.slice(1)
    this.props.retrieveOrder(orderId)
  }

  openGetDriverModal() {
    this.setState({ getDriverModalIsOpen: true });
  }

  closeGetDriverModal() {
    this.setState({ getDriverModalIsOpen: false, filteredDrivers: [], value: [] });
  }

  openDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: true });
  }

  closeDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: false });
  }

  submitDeleteForm() {
    this.props.deleteOrder(this.props.currentOrder.data.id)

    let updatedData = this.props.orders.data.filter( ord => {
      return +ord.id !== +this.props.currentOrder.data.id
    })

    this.props.orders.data = updatedData

    this.closeDeleteOrderModal()
    this.props.history.push('/admin/orders')
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

  onHoverChange = (hoverValue) => {
    this.setState({ hoverValue });
  }

  getDriverFromOrder() {
    let driverId = this.props.currentOrder.data.driver
    
    if (!driverId) return <span onClick={() => this.openGetDriverModal()}>Appoint a driver</span>
    
    let drivers = this.props.drivers.data,
    
        current =  drivers.filter(drv => {
          return +drv.id === +driverId
        })

    current = current[0]

    return current.user.first_name || current.user.last_name ?

		`${current.user.first_name} ${current.user.last_name}` :

		current.user.username     
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

  setDriver() {
    let driverId = this.setDriverSelect.value

    if (driverId ) {
      let target = this.props.currentOrder.data

      target.driver = driverId
      target.status = allConst.STATUS_WAIT
      this.props.setDriver(target)

      let targetInList = this.props.orders.data.filter( ord => {
        return +ord.id === +this.props.currentOrder.data.id
      })
      
      targetInList = targetInList[0]
      targetInList.driver = driverId
      targetInList.status = allConst.STATUS_WAIT

      this.closeGetDriverModal()
    }
  }

  clearDriverFilter() {
		this.setState({ filteredDrivers: [], value : [] })
  }
  
  render() {
    let orderId = this.props.match.params.orderId.slice(1),
        currentOrder = this.props.currentOrder.data

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
        {!this.props.currentOrder.isFetched || !this.props.drivers.isFetched ? (
          <img className="spinner" src={spinner} alt="spinner" />
        ) : (
        <div className="content">

          <div className="content-label">
            <h1>Order #{this.props.currentOrder.data.id}</h1>
          </div>
          
          <div className="content-label">
            <h5>Order data:</h5>
          </div>

          <table className="default-table vertical">
            <tbody>
              <tr>
                <td>Transfer price with discount</td><td>{currentOrder.transfer_price_with_discount}</td></tr>
              <tr>
                <td>Transfer price</td><td>{currentOrder.transfer_price}</td></tr>
              <tr>
                <td>Promo-code</td><td>{currentOrder.promo_code}</td></tr>
              <tr>
                <td>Transfer-type</td><td>{currentOrder.transfer_type}</td></tr>
              <tr>
                <td>Pick up location</td><td>{currentOrder.pick_up_location}</td></tr>
              <tr>
                <td>Drop off location</td><td>{currentOrder.drop_off_location}</td></tr>
              <tr>
                <td>Flight number</td><td>{currentOrder.flight_number}</td></tr>
              <tr>
                <td>Transfer date</td><td>{currentOrder.transfer_date}</td></tr>
              <tr>
                <td>Transfer time</td><td>{currentOrder.transfer_time}</td></tr>
              <tr>
                <td>Return journey date</td><td>{currentOrder.return_journey_date}</td></tr>
              <tr>
                <td>Return journey time</td><td>{currentOrder.return_journey_time}</td></tr>
              <tr>
                <td>Discount</td><td>{currentOrder.discount}</td></tr>
              <tr>
                <td>Adults</td><td>{currentOrder.adults}</td></tr>
              <tr>
                <td>Children 0-9kg</td><td>{currentOrder.children_0_9}</td></tr>
              <tr>
                <td>Children 9-18kg</td><td>{currentOrder.children_9_18}</td></tr>
              <tr>
                <td>Children 18-36kg</td><td>{currentOrder.children_18_36}</td></tr>
              <tr>
                <td>Car</td><td>{currentOrder.car_type}</td></tr>
              <tr>
                <td>Customer name</td><td>{currentOrder.customer_name}</td></tr>
              <tr>
                <td>Customer phone</td><td>{currentOrder.customer_phone}</td></tr>
              <tr>
                <td>Customer email</td><td>{currentOrder.customer_email}</td></tr>
              <tr>
                <td>Payment type</td><td>{currentOrder.payment_method}</td></tr>
              <tr>
                <td>Card</td><td>{currentOrder.card}</td></tr>
              <tr>
                <td>Comment</td><td>{currentOrder.comment}</td></tr>
            </tbody>
          </table>

          <div className="table-footer">
            <div><h5>Date of creation:</h5>{currentOrder.date}</div>
            <div><h5>Driver:</h5> {this.getDriverFromOrder()}</div>
            <div><h5>Status:</h5> {currentOrder.status}</div>
          </div>

          <div className="btn-wrap left">
            <Link to={`/admin/edit_ord:${orderId}`} className="button small">Edit</Link>
            <button className="button small grey" onClick={() => this.openDeleteOrderModal()}>Delete</button>
          </div>

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

          <Modal
            isOpen={this.state.deleteOrderModalIsOpen}
            onRequestClose={this.closeDeleteOrderModal}
            style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
            className="modal"
            ariaHideApp={false}
          >
            <button className="close-btn" onClick={() => this.closedeleteOrderModal()} />
            <p>Вы уверены, что хотите удалить заказ?</p>
            <div className="btn-wrap">
              <button className="button small" onClick={this.submitDeleteForm.bind(this)}>
                Ок
              </button>
              <button className="button small" onClick={this.closeDeleteOrderModal}>
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
