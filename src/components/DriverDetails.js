import '../assets/styles/calendar.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import FullCalendar from 'rc-calendar/lib/FullCalendar';

import '../assets/styles/select.css';
import Select from 'rc-select';

import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

import Modal from 'react-modal'

import spinner from '../assets/images/loading.gif'
import * as allConst from '../constants/index'

const format = 'YYYY-MM-DD';
const cn = window.location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');


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
    this.openDeleteDriverModal = this.openDeleteDriverModal.bind(this);
    this.closeDeleteDriverModal = this.closeDeleteDriverModal.bind(this);
    this.openScheduleModal = this.openScheduleModal.bind(this)
    this.closeScheduleModal = this.closeScheduleModal.bind(this)

    let driverId = this.props.match.params.driverId.slice(1)
    this.props.retrieveDriver(driverId)
  }

  componentDidUpdate() {
    if (this.props.currentDriver.isFetched) {
     
      this.fillSchedule()
    }
  }

  fillSchedule() {
    let workdays = this.props.currentDriver.data.work_schedule.workdays,
          dates = document.querySelectorAll('.rc-calendar-full .rc-calendar-cell')
    
        for ( let j = 0; j < dates.length; j++ ) {

          for (let i = 0; i < workdays.length; i++) {

            if ( moment(dates[j].getAttribute('title')).isSame(workdays[i].date) ) {

              dates[j].classList.add('work-schedule-selected-day')
            }
          }
        }
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

    let workday = this.props.currentDriver.data.work_schedule.workdays.filter( w => {
      return moment(w.date).isSame(this.state.select)
    })

    if (workday.length > 0) {
      workday = workday[0]

      this.setState({
        start: workday.start,
        end: workday.end
      })

    }
   
  }

  closeScheduleModal() {
    this.setState({ scheduleModalIsOpen: false, start: '', end: '' })
  }

  openDeleteDriverModal() {
		this.setState({ deleteDriverModalIsOpen: true });
	}

	closeDeleteDriverModal() {
		this.setState({ deleteDriverModalIsOpen: false });
	}

  openDeleteOrderModal(orderId) {
    this.setState({ deleteOrderModalIsOpen: true , currentOrder: orderId });
  }

  closeDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: false });
  }

  submitDeleteDriverForm() {
		this.props.deleteDriver(this.props.currentDriver.data.id)
    this.closeDeleteDriverModal()
    this.props.history.push('/admin/drivers')
	}

  submitDeleteOrderForm() {
    this.props.deleteOrder(this.state.currentOrder)
     
    let updatedData = this.props.currentDriver.data.orders.filter( ord => {
      return ord.id != this.state.currentOrder
    })

    this.props.currentDriver.data.orders = updatedData

    this.closeDeleteOrderModal()
  }
  
  render() {
    let _driverId = this.props.match.params.driverId

    return (
      <div className="content-wrap">
        {
          !this.props.currentDriver.isFetched ? (
            <img className="spinner" src={spinner} />
          ) : (
            <div className="content">
              <div className="content-box">
                <div className="content-box-row">
                  <div className="content-box-cell">
                    <label>First name: <input type="text" value={this.props.currentDriver.data.user.first_name} disabled /></label>
                    <label>Last name: <input type="text" value={this.props.currentDriver.data.user.last_name} disabled /></label>
                    <label>Username: <input type="text" value={this.props.currentDriver.data.user.username} disabled /></label>
                    <div className="btn-wrap left">
                      <Link to={`/admin/edit_drv${_driverId}`} className="button small">Ред.</Link>
                      <span onClick={() => this.openDeleteDriverModal()} className="button small grey">Удал.</span>
                    </div>
                  </div>
                  <div className="content-box-cell">
                    <label>E-mail: <input type="text" value={this.props.currentDriver.data.user.email} disabled /></label>
                    <label>Car: <input type="text" value={this.props.currentDriver.data.car} disabled /></label>
                    <label>Car number: <input type="text" value={this.props.currentDriver.data.number_of_car} disabled /></label>
                  </div>
                  <div className="content-box-cell">
                    <h5>Рабочее время:</h5>
                    <FullCalendar
                      Select={Select}
                      fullscreen={false}
                      onSelect={this.onSelect.bind(this)}
                      defaultValue={now}
                      onTypeChange={this.onTypeChange.bind(this)}
                      locale={cn ? zhCN : enUS}
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
                              <td>{ord.date}</td>
                              <td>{ord.status}</td>
                              <td>
                                <Link to={`/admin/det_ord:${ord.id}`}>Дет.</Link>
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
                <form  ref={form => this.scheduleForm = form}>
                  <button className="close-btn" onClick={this.closeScheduleModal.bind(this)}></button>
                  <h4>{this.state.select}</h4>
                  <label>Work day: <input type="text" name="workDay" value={this.state.select} disabled/></label>
                  <label>Work day start:  <input type="time" name="startTime" value={this.state.start} disabled/></label>
                  <label>Work day end:  <input type="time" name="endTime" value={this.state.end} disabled/></label>
                  <div className="btn-wrap">
                    <button type="submit" className="button small">Ок</button>
                    <button type="recet" className="button small" onClick={this.closeScheduleModal.bind(this)}>Отмена</button>
                  </div>
                </form>
              </Modal>
            </div>
          )
        }
      </div>
    );
  }
}