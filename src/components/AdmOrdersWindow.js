import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Modal from 'react-modal'
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
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

const now = moment();
if (cn) {
  now.utcOffset(8);
} else {
  now.utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = (
  <TimePickerPanel
    defaultValue={[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}
  />
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
  return current.isBefore(date);  // can not select days before today
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


export default class AdmOrdersWindow extends Component {
  constructor() {
    super()

    this.state = {
      value: [],
      hoverValue: [],
      filteredDrivers: [],
      deleteOrderModalIsOpen: false,
      currentOrder: null,
      getDriverModalIsOpen: false,
    }

    this.openDeleteOrderModal = this.openDeleteOrderModal.bind(this);
    this.closeDeleteOrderModal = this.closeDeleteOrderModal.bind(this);
    this.openGetDriverModal = this.openGetDriverModal.bind(this);
    this.closeGetDriverModal = this.closeGetDriverModal.bind(this);
  }

  newOrders() {
    return this.props.orders.data.filter(ord => {
      console.log(allConst.STATUS_NEW + ord.status === allConst.STATUS_WAIT)
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

  getDriverName(userName) {
    let driver = this.props.drivers.data.filter(drv => {
      return drv.user.username === userName
    })

    return `${driver[0].user.first_name} ${driver[0].user.last_name}`
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
                <td className="xxsmall">Водитель:</td>
                <td className="xxsmall" />
              </tr>
            </thead>
            <tbody>
              {this.newOrders().map((n) => {
                return (
                  <tr key={n.id}>
                    <td>{n.id}</td>
                    <td>{n.date}</td>
                    <td>{n.status}</td>
                    <td>
                      <span onClick={() => this.openGetDriverModal(n.id)}>Назначить</span></td>
                    <td>
                      <Link to={`/admin/det_ord:${n.id}`}>Дет.</Link>
                      <span onClick={() => this.openDeleteOrderModal(n.id)}>Удал.</span>
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
                <td className="xxsmall">Водитель</td>
                <td className="xxsmall" />
               </tr>
            </thead>
            <tbody>
              {this.activeOrders().map((a) => {
                return (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.date}</td>
                    <td>{a.status}</td>
                    <td>
                      <Link to={`/admin/det_drv:${a.driver}`}>{this.getDriverName(a.driver)}</Link></td>
                    <td>
                      <Link to={`/admin/det_ord:${a.id}`}>Дет.</Link>
                      <span onClick={() => this.openDeleteOrderModal(a.id)}>Удал.</span>
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
                <td className="xxsmall">Водитель</td>
                <td className="xxsmall" />
              </tr>
            </thead>
            <tbody>
              {this.executedOrders().map((e) => {
                return (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.date}</td>
                    <td>{e.status}</td>
                    <td>
                      <Link to={`/admin/det_drv:${e.driver}`}>{this.getDriverName(e.driver)}</Link></td>
                    <td>
                      <Link to={`/admin/det_ord:${e.id}`}>Дет.</Link>
                      <span onClick={() => this.openDeleteOrderModal(e.id)}>Удал.</span>
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

  openDeleteOrderModal(orderId) {
    this.setState({ deleteOrderModalIsOpen: true , currentOrder: orderId });
  }

  closeDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: false });
  }

  openGetDriverModal(orderId) {
    this.setState({ getDriverModalIsOpen: true , currentOrder: orderId});
  }

  closeGetDriverModal() {
    this.setState({ getDriverModalIsOpen: false });
  }

  onChange = (value) => {
    console.log('onChange', value);
    this.setState({ value });
  }

  onHoverChange = (hoverValue) => {
    this.setState({ hoverValue });
  }

  setDriver() {
    let _orderId = this.state.currentOrder,
        _driverId = this.setDriverSelect.value

    if (_driverId) {
      let target = this.props.orders.filter( ord => {
        return ord.id === _orderId
      })
      
      target = target[0]
      target.driver = _driverId
      target.status = "wait for accepting"
      this.props.setDriver(target)

      this.closeDeleteOrderModal()
    }
  }

  submitDeleteForm() {
    this.props.deleteOrder(this.state.currentOrder)
    this.closeDeleteOrderModal()
  }

  render() {
    const calendar = (
      <RangeCalendar
        hoverValue={this.state.hoverValue}
        onHoverChange={this.onHoverChange}
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        defaultValue={[now, now.clone().add(1, 'months')]}
        locale={cn ? zhCN : enUS}
        timePicker={timePickerElement}
      />
    )
    
    return (
      <div className="content-wrap">
        {!this.props.orders.isFetched ? (
          <img className="spinner" src={spinner} />
        ) : (
        <div className="content">
          <div className="content-label">
            <h1>Заказы</h1>
            <Link to='/admin/reg_ord' className="button grey">Новый заказ</Link>
          </div>
          {this.checkAllOrders()}
          <div className="content-box">
            <div className="content-box-row">
              {this.checkNewOrders()}
              {this.checkActiveOrders()}
            </div>
            <div className="content-box-row">
              {this.checkExecutedOrders()}
            </div>
          </div>
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
            <label>Выберите дату: <Picker
              value={this.state.value}
              onChange={this.onChange}
              animation="slide-up"
              calendar={calendar}
            >
              {
                ({ value }) => {
                  return (
                    <input
                      placeholder="please select"
                      disabled={this.state.disabled}
                      readOnly
                      type="text"
                      value={isValidRange(value) && `${format(value[0])} - ${format(value[1])}` || ''}
                    />
                  );
                }
              }
            </Picker></label>
            <label>Водители:
            <select ref={ select => this.setDriverSelect = select} size="6" style={{ height: "125px" }}>
              {this.props.drivers.data.map(d => {
                return (
                  <option value={d.id}>{`${d.user.first_name} ${d.user.last_name}`}</option>
                )
              })}
            </select>
            </label>
            <div className="btn-wrap">
              <button type="submit" className="button small" onClick={this.setDriver.bind(this)}>Принять</button>
              <button type="reset" className="button small">Отмена</button>
            </div>
          </Modal>   
        </div>
        )}
      </div>
    );
  }
}

