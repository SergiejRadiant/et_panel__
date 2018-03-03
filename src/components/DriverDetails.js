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
  constructor() {
    super()

    this.state = {
      orders: [
        {
          id: 'juGo8sGikjom15C',
          from: 'Sabinaview, 721 Brannon Bypass',
          to: 'West Maddison, 18434 Mayra Path',
          date: '489-187-6560',
          back: 'none',
          vehicle: 'Handmade Plastic Shoes',
        },
        {
          id: 'e_UF7It5ffgFV1s',
          from: 'North Caylaburgh, 04945 Cronin Trail',
          to: 'Jadyntown, 2618 Stanton Manor',
          date: '863-406-4170',
          back: '087-806-8318',
          vehicle: 'Rustic Granite Hat',
        },
        {
          id: 'iplt9o7AYsmk5dI',
          from: 'South Jaydeside, 8515 Wiegand Pass',
          to: 'New Adela, 910 Rolando Stravenue',
          date: '248-874-6893',
          back: 'none',
          vehicle: 'Incredible Fresh Towels',
        },
        {
          id: 'ItExv8K6JjuhTgl',
          from: 'Emmerichville, 400 Jovan Ramp',
          to: 'Port Glendaburgh, 86654 Ferry Avenue',
          date: '579-324-7881',
          back: '550-690-3656',
          vehicle: 'Generic Soft Salad',
        }
      ],
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
  }

  onTypeChange(type) {
    this.setState({
      type
    })
  }

  onSelect(value) {
    this.setState({ select: value.format(format) })
    this.openScheduleModal()
  }

  openDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: true });
  }

  closeDeleteOrderModal() {
    this.setState({ deleteOrderModalIsOpen: false });
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

  render() {
    let _driverId = this.props.match.params.driverId

    return (
      <div className="content-wrap">
        <div className="content">
          <div className="content-box">
            <div className="content-box-row">
              <div className="content-box-cell">
                <label>Имя: <input type="text" value="Mrs. Shanel Halvorson" disabled /></label>
                <label>Телефон: <input type="text" value="574-990-0320" disabled /></label>
                <label>Месседжер: <input type="text" value="Odessa16" disabled /></label>
                <label>E-mail: <input type="text" value="Ophelia.Fritsch57@yahoo.com" disabled /></label>
                <div className="btn-wrap left">
                  <Link to={`/admin/edit_drv${_driverId}`} className="button small">Ред.</Link>
                  <span onClick={() => this.openDeleteDriverModal()} className="button small grey">Удал.</span>
                </div>
              </div>
              <div className="content-box-cell">
                <label>Марка авто: <input type="text" value="Audi A4" disabled /></label>
                <label>Номер авто: <input type="text" value="345678" disabled /></label>
                <label>Доп. информация: <textarea value="..." disabled /></label>
              </div>
              <div className="content-box-cell">
                <h5>Рабочее время:</h5>
                <FullCalendar
                  Select={Select}
                  fullscreen={false}
                  onSelect={this.onSelect.bind(this)}
                  defaultValue={now}
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
                      <td>Order Num.</td>
                      <td>Откуда</td>
                      <td>Куда</td>
                      <td>Дата</td>
                      <td>Поездка обратно</td>
                      <td>Авто</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.orders.map(ord => {
                      return (
                        <tr key={ord.id}>
                          <td>{ord.id}</td>
                          <td>{ord.from}</td>
                          <td>{ord.to}</td>
                          <td>{ord.date}</td>
                          <td>{ord.back}</td>
                          <td>{ord.vehicle}</td>
                          <td>
                            <Link to={`/admin/det_ord:${ord.id}`}>Дет.</Link>
                            <Link to={`/admin/edit_ord:${ord.id}`}>Ред.</Link>
                            <span onClick={() => this.openDeleteOrderModal()}>Удал.</span>
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
            isOpen={this.state.deleteOrderModalIsOpen}
            onRequestClose={this.closeDeleteOrderModal}
            style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
            className="modal"
            ariaHideApp={false}
          >
            <form>
              <button className="close-btn" onClick={() => this.closeDeleteOrderModal()} />
              <p>Вы уверены, что хотите удалить заказ?</p>
              <div className="btn-wrap">
                <button type="submit" className="button small">
                  Ок
								</button>
                <button type="recet" className="button small" onClick={this.closeDeleteOrderModal}>
                  Отмена
								</button>
              </div>
            </form>
          </Modal>
          <Modal
            isOpen={this.state.deleteDriverModalIsOpen}
            onRequestClose={this.closeDeleteDriverModal}
            style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
            className="modal"
            ariaHideApp={false}
          >
            <form>
              <button className="close-btn" onClick={() => this.closeDeleteDriverModal()} />
              <p>Вы уверены, что хотите удалить пользователя?</p>
              <div className="btn-wrap">
                <button type="submit" className="button small">
                  Ок
								</button>
                <button type="recet" className="button small" onClick={this.closeDeleteDriverModal}>
                  Отмена
								</button>
              </div>
            </form>
          </Modal>
          <Modal
            isOpen={this.state.scheduleModalIsOpen}
            onRequestClose={this.closeScheduleModal}
            style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: "1000" } }}
            className="modal"
            ariaHideApp={false}
          >
            <h4>{this.state.select}</h4>
            <button className="close-btn" onClick={this.closeScheduleModal}></button>
            <form>
              <p>Введите время.</p>
              <label>C: <input type="text" name="since" placeholder="HH : MM" /></label>
              <label>До: <input type="text" name="until" placeholder="HH : MM" /></label>

              <div className="btn-wrap">
                <button type="submit" className="button small">Ок</button>
                <button type="recet" className="button small" onClick={this.closeScheduleModal}>Отмена</button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    );
  }
}