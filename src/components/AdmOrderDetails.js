import React, { Component } from 'react'
import Modal from 'react-modal'
import spinner from '../assets/images/loading.gif'
import Picker from 'rc-calendar/lib/Picker'
import RangeCalendar from 'rc-calendar/lib/RangeCalendar'
import zhCN from 'rc-calendar/lib/locale/zh_CN'
import enUS from 'rc-calendar/lib/locale/en_US'
import TimePickerPanel from 'rc-time-picker/lib/Panel'
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

const now = moment();
if (cn) {
  now.utcOffset(8);
} else {
  now.utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

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

const formatStr = 'YYYY-MM-DD';

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
      value: [],
      hoverValue: [],
      getDriverModalIsOpen: false,
      deleteOrderModalIsOpen: false
    }
    this.openGetDriverModal = this.openGetDriverModal.bind(this);
    this.closeGetDriverModal = this.closeGetDriverModal.bind(this);
    this.openDeleteOrderModal = this.openDeleteOrderModal.bind(this);
    this.closeDeleteOrderModal = this.closeDeleteOrderModal.bind(this);
    
    let _orderId = this.props.match.params.orderId.slice(1)

    this.props.retrieveOrder(_orderId)
  }

  openGetDriverModal() {
    this.setState({ getDriverModalIsOpen: true });
  }

  closeGetDriverModal() {
    this.setState({ getDriverModalIsOpen: false });
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
      return ord.id != this.props.currentOrder.data.id
    })

    this.props.orders.data = updatedData

    this.closeDeleteOrderModal()

    //доделать переход
  }

  onChange = (value) => {
    console.log('onChange', value);
    this.setState({ value });
  }

  onHoverChange = (hoverValue) => {
    this.setState({ hoverValue });
  }

  getDriverName() {
    let driverId = this.props.currentOrder.data.driver,
        orderId = this.props.currentOrder.data.id
    
    if (!driverId) return <span onClick={(orderId) => this.openGetDriverModal(orderId)}>Appoint a driver</span>
    
    let drivers = this.props.drivers.data,
    
        currentDriver =  drivers.filter(drv => {
          return +drv.id === +driverId
        })

    currentDriver = currentDriver[0]

    return `${currentDriver.user.first_name} ${currentDriver.user.last_name}`     
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

  render() {
    const calendar = (
      <RangeCalendar
        hoverValue={this.state.hoverValue}
        onHoverChange={this.onHoverChange}
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        defaultValue={[now, now.clone().add(1, 'months')]}
        locale={cn ? zhCN : enUS}
      />
    )

    return (
      <div className="content-wrap">
        {!this.props.currentOrder.isFetched || !this.props.drivers.isFetched ? (
          <img className="spinner" src={spinner} />
        ) : (
        <div className="content">

          <div className="content-label">
            <h1 style={{ fontSize: "25px"}}>Order #{this.props.currentOrder.data.id}</h1>
          </div>
          
          <div className="content-label">
            <h5>Информация о заказе:</h5>
          </div>

          <table className="default-table vertical">
            <tbody>
              {this.props.currentOrder.data.data.map( d => {
                return (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.value}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="table-footer">
            <div><h5>Date of creation:</h5> {this.props.currentOrder.data.date}</div>
            <div><h5>Driver:</h5> {this.getDriverName()}</div>
            <div><h5>Status:</h5> {this.props.currentOrder.data.status}</div>
          </div>

          <div className="btn-wrap">
            <button className="button small grey left" onClick={() => this.openDeleteOrderModal()}>Delete</button>
          </div>

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
