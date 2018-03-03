import '../assets/styles/calendar.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from 'rc-calendar/lib/FullCalendar';

import '../assets/styles/select.css';
import Select from 'rc-select';

import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

import Modal from 'react-modal'

const format = 'DD.MM.YYYY';
const cn = window.location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');


export default class Shedule extends Component {
  constructor() {
    super()

    this.state = {
      type: 'date',
      scheduleModalIsOpen: false,
      select: ''
    }

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

  openScheduleModal() {
    this.setState({ scheduleModalIsOpen: true })
  }

  closeScheduleModal() {
    this.setState({ scheduleModalIsOpen: false })
  }

  render() {
    return (
      <div className="content-wrap schedule">
        <div className="content">
          <FullCalendar
            Select={Select}
            fullscreen
            defaultValue={now}
            onSelect={this.onSelect.bind(this)}
            type={this.state.type}
            onTypeChange={this.onTypeChange.bind(this)}
            locale={cn ? zhCN : enUS}
          />
          <Modal
            isOpen={this.state.scheduleModalIsOpen}
            onRequestClose={this.closeScheduleModal}
            style={{overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: "1000" }}}
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