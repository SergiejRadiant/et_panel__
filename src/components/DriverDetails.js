import '../assets/styles/calendar.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from 'rc-calendar/lib/FullCalendar';

import '../assets/styles/select.css';
import Select from 'rc-select';

import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';

import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

import Modal from 'react-modal'

import spinner from '../assets/images/loading.gif'

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const format = 'YYYY-MM-DD';
const formatStr = 'DD.MM.YYYY';

const cn = window.location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

export default class DriverDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      start: '',
      end: '',
      type: 'date',
      select: '',
      scheduleModalIsOpen: false,
      deleteOrderModalIsOpen: false,
      deleteDriverModalIsOpen: false
    }

    this.openDeleteOrderModal = this.openDeleteOrderModal.bind(this);
    this.closeDeleteOrderModal = this.closeDeleteOrderModal.bind(this);
    this.openScheduleModal = this.openScheduleModal.bind(this)
    this.closeScheduleModal = this.closeScheduleModal.bind(this)

    let driverId = this.props.match.params.driverId.slice(1)
    this.props.retrieveDriver(driverId)
  }

  renderDate(m) {
    let workdays = this.props.currentDriver.data.work_schedule.workdays,
        count = -1

    for (let w of workdays) {
      
      if (moment(m._d.toDateString()).isSame(w.date) && count < 0) {
        count++
      }

    }
    
    return ~count ? (

    <div className="rc-calendar-date work-schedule-selected-day">{moment(m).date()}</div>) :

    <div className="rc-calendar-date">{moment(m).date()}</div>

  }

  onTypeChange(type) {
    this.setState({
      type
    })
  }

  onSelect(value) {
    this.setState({ select: value.format(format) })
    if (this.state.type === 'date') {
      this.openScheduleModal()
    }
  }

  openDeleteDriverModal() {
    this.setState({ deleteDriverModalIsOpen: true });
  }

  closeDeleteDriverModal() {
    this.setState({ deleteDriverModalIsOpen: false });
  }

  openScheduleModal() {
    this.setState({ scheduleModalIsOpen: true })
  }

  closeScheduleModal() {
    this.setState({ scheduleModalIsOpen: false })
  }

  openDeleteOrderModal(orderId) {
    this.setState({ deleteOrderModalIsOpen: true , currentOrder: orderId });
  }

  closeDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: false });
  }

  getDayOfSchedule() {

    let workday = this.props.currentDriver.data.work_schedule.workdays.filter( w => {
      return moment(w.date).isSame(this.state.select)
    })

    if (workday.length > 0) {
      workday = workday[0]

      return (

        <form onSubmit={(e) => e.preventDefault()}>

          <button className="close-btn" onClick={this.closeScheduleModal}></button>

          <h4>{moment(workday.date).format(formatStr)}</h4>

          <label>Work day: <input type="text" name="workDay" value={moment(workday.date).format(formatStr)} disabled/></label>
          <label>Work day start:  <input type="text" value={workday.start} disabled /></label>
          <label>Work day end:  <input type="text" value={workday.end} disabled /></label>
          
          <div className="btn-wrap">
            <button type="submit" className="button small" onClick={this.closeScheduleModal.bind(this)}>Ок</button>
          </div>

        </form>

      )

    }

    return (

      <div>
        <button className="close-btn" onClick={this.closeScheduleModal.bind(this)}></button>

        <p>Выходной</p>

        <div className="btn-wrap">
          <button className="button small" onClick={this.closeScheduleModal.bind(this)}>Ок</button>
        </div>
        
      </div>

    )
      
  }

  submitDeleteDriverForm() {
    this.props.deleteDriver(this.props.currentDriver.data.id)
    
    this.closeDeleteDriverModal()

    let updatedData = this.props.drivers.data.filter( ord => {
      return +ord.id !== +this.props.currentDriver.data.id
    })

    this.props.drivers.data = updatedData

    this.props.history.push('/admin/drivers')
	}

  submitDeleteOrderForm() {
    this.props.deleteOrder(this.state.currentOrder)
     
    let updatedData = this.props.currentDriver.data.orders.filter( ord => {
      return +ord.id !== +this.state.currentOrder
    })

    let updatedOrdersList = this.props.orders.data.filter( ord => {
      return +ord.id !== +this.state.currentOrder
    })

    this.props.currentDriver.data.orders = updatedData
    this.props.orders.data = updatedOrdersList
    
    this.closeDeleteOrderModal()
  }
  
  render() {
    let driverId = this.props.match.params.driverId

    return (
      <div className="content-wrap">
        {
          !this.props.currentDriver.isFetched ? (
            <img className="spinner" src={spinner}alt="spinner" />
          ) : (
            <div className="content">
              <div className="content-box">
                <div className="content-box-row">
                  <div className="content-box-cell order-2">
                    <label>First name: <input type="text" value={this.props.currentDriver.data.user.first_name} disabled /></label>
                    <label>Last name: <input type="text" value={this.props.currentDriver.data.user.last_name} disabled /></label>
                    <label>E-mail: <input type="text" value={this.props.currentDriver.data.user.email} disabled /></label>
                    <div className="btn-wrap left">
                      <Link to={`/admin/edit_drv${driverId}`} className="button small">Ред.</Link>
                      <span onClick={() => this.openDeleteDriverModal()} className="button small grey">Удал.</span>
                    </div>
                  </div>
                  <div className="content-box-cell order-1">
                    <label>Username: <input type="text" value={this.props.currentDriver.data.user.username} disabled /></label>
                    <label>Car: <input type="text" value={this.props.currentDriver.data.car} disabled /></label>
                    <label>Car number: <input type="text" value={this.props.currentDriver.data.number_of_car} disabled /></label>
                  </div>
                  <div className="content-box-cell order-3">
                    <h5>Рабочее время:</h5>
                    <FullCalendar
                      Select={Select}
                      fullscreen={false}
                      onSelect={this.onSelect.bind(this)}
                      onTypeChange={this.onTypeChange.bind(this)}
                      locale={cn ? zhCN : enUS}
                      dateCellRender={(m) => this.renderDate(m)}
                    />
                  </div>
                </div>
                <div className="content-box-row">
                  <div className="content-box-cell wide">
                    <h5>Заказы:</h5>
                    <table className="default-table">
                      <thead>
                        <tr>
                          <td className="xsmall">Num.</td>
                          <td className="xsmall">Date</td>
                          <td className="xsmall">Status</td>
                          <td className="xxsmall"></td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.currentDriver.data.orders.map(ord => {
                          return (
                            <tr key={ord.id}>
                              <td>{ord.id}</td>
                              <td>{moment(ord.date).format(formatStr)}</td>
                              <td>{ord.status}</td>
                              <td>
                                <Link to={`/admin/det_ord:${ord.id}`}>Дет.</Link>
                                <Link to={`/admin/edit_ord:${ord.id}`}>Ред.</Link>
                                <span onClick={(orderId) => this.openDeleteOrderModal(ord.id)}>Удал.</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <Modal
                isOpen={this.state.deleteDriverModalIsOpen}
                onRequestClose={this.closeDeleteDriverModal}
                style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
                className="modal"
                ariaHideApp={false}
              >
                <button className="close-btn" onClick={this.closeDeleteDriverModal.bind(this)} />
                <p>Вы уверены, что хотите удалить пользователя?</p>
                <div className="btn-wrap">
                  <button type="submit" className="button small" onClick={this.submitDeleteDriverForm.bind(this)}>
                    Ок
                  </button>
                  <button type="recet" className="button small" onClick={this.closeDeleteDriverModal.bind(this)}>
                    Отмена
                  </button>
                </div>
              </Modal>
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
                  <button type="submit" className="button small" onClick={this.submitDeleteOrderForm.bind(this)}>
                    Ок
                  </button>
                  <button type="recet" className="button small" onClick={this.closeDeleteOrderModal}>
                    Отмена
                  </button>
                </div>
              </Modal>
              <Modal
                isOpen={this.state.scheduleModalIsOpen}
                onRequestClose={this.closeScheduleModal}
                style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: "1000" } }}
                className="modal"
                ariaHideApp={false}
              >
                {this.getDayOfSchedule()} 
              </Modal>
            </div>
          )
        }
      </div>
    );
  }
}