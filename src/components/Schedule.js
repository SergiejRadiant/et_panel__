import '../assets/styles/calendar.css'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FullCalendar from 'rc-calendar/lib/FullCalendar'
import Picker from 'rc-calendar/lib/Picker'
import RangeCalendar from 'rc-calendar/lib/RangeCalendar'
import Select from 'rc-select'

import '../assets/styles/select.css'
import '../assets/styles/picker.css'
import spinner from '../assets/images/loading.gif'

import zhCN from 'rc-calendar/lib/locale/zh_CN'
import enUS from 'rc-calendar/lib/locale/en_US'

import 'moment/locale/zh-cn'
import 'moment/locale/en-gb'

import Modal from 'react-modal'

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const cn = window.location.search.indexOf('cn') !== -1

const now = moment();
if (cn) {
  now.utcOffset(8);
} else {
  now.utcOffset(0);
}

function disabledDate(current) {
  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.isBefore(date);  // can not select days before today
}

const formatStr = 'DD.MM.YYYY'

function format(v) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

function onStandaloneChange(value) {
  console.log(value[0] && format(value[0]), value[1] && format(value[1]));
}

function onStandaloneSelect(value) {
  console.log(format(value[0]), format(value[1]));
}

export default class Shedule extends Component {
  constructor() {
    super()

    this.state = {
      value: [],
      hoverValue: [],
      type: 'date',
      scheduleModalIsOpen: false,
      setScheduleModalIsOpen: false,
      select: ''
    }

    this.openScheduleModal = this.openScheduleModal.bind(this)
    this.closeScheduleModal = this.closeScheduleModal.bind(this)
    this.openSetScheduleModal = this.openSetScheduleModal.bind(this)
    this.closeSetScheduleModal = this.closeSetScheduleModal.bind(this)
  }

  renderDate(m) {
    let workdays = this.props.currentDriver.data.work_schedule.workdays,
        count = -1

    for (let w of workdays) {
      
      if (moment(m._d.toDateString()).isSame(w.date) && count < 0) {
        count++
      }
          
    }
    
    return ~count && moment(m).isBefore(now) ?

    <div className="rc-calendar-date work-schedule-disabled-day work-schedule-selected-day">{moment(m).date()}</div> :

    moment(m).isBefore(now) ?

    <div className="rc-calendar-date work-schedule-disabled-day">{moment(m).date()}</div> :
   
    ~count ?

    <div className="rc-calendar-date work-schedule-selected-day">{moment(m).date()}</div> :

    <div className="rc-calendar-date">{moment(m).date()}</div>
  }

  onTypeChange(type) {
    this.setState({
      type
    })
  }

  onSelect(value) {
    let workday = this.props.currentDriver.data.work_schedule.workdays.filter( w => {
      return moment(w.date).isSame(value._d.toDateString())
    })

    if  
      (
        this.state.type === 'date' && workday.length > 0 || 
        this.state.type === 'date' && !moment(value).isBefore(now)
      ) 

      {
        this.openScheduleModal()
        this.setState({ select: value.format(formatStr) })
      }
  }

  openScheduleModal() {
    this.setState({ scheduleModalIsOpen: true })
  }

  closeScheduleModal() {
    this.setState({ scheduleModalIsOpen: false })
  }

  openSetScheduleModal() {
    this.setState({ setScheduleModalIsOpen: true })
  }

  closeSetScheduleModal() {
    this.setState({ setScheduleModalIsOpen: false, value: [] })
  }

  onChange = (value) => {
    this.setState({ value });
  }

  onHoverChange = (hoverValue) => {
    this.setState({ hoverValue });
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

          <h4>{workday.date}</h4>

          <label>Work day: <input type="text" name="workDay" value={workday.date} disabled/></label>
          <label>Work day start:  <input type="text" value={workday.start} disabled /></label>
          <label>Work day end:  <input type="text" value={workday.end} disabled /></label>
          
          <div className="btn-wrap">
            <button type="submit" className="button small" onClick={this.closeScheduleModal.bind(this)}>Ок</button>
          </div>

        </form>

      )

    }

    return (

      <form  ref={form => this.scheduleForm = form}  onSubmit={(e) => this.submitSchedule(e)}>
        <button className="close-btn" onClick={this.closeScheduleModal.bind(this)}></button>

        <h4>{this.state.select}</h4>

        <label>Work day: <input type="text" name="workDay" value={this.state.select} disabled/></label>
        <label>Work day start:  <input type="time" name="startTime" required/></label>
        <label>Work day end:  <input type="time" name="endTime" required/></label>

        <div className="btn-wrap">
          <button type="submit" className="button small">Ок</button>
          <button type="recet" className="button small" onClick={this.closeScheduleModal.bind(this)}>Отмена</button>
        </div>
        
      </form>

    )
      
  }

  submitSchedule(e) {
    e.preventDefault()

    let workDay = this.scheduleForm.workDay.value,
        startTime = this.scheduleForm.startTime.value,
        endTime = this.scheduleForm.endTime.value,
        driver = this.props.currentDriver.data,
        workSchedule = driver.work_schedule.id,
        workdays = driver.work_schedule.workdays,
        newWorkdays = []

    newWorkdays.push({
      date: workDay,
      start: startTime,
      end: endTime,
    })

    workdays.push(...newWorkdays)

    this.props.setSchedule(newWorkdays, workSchedule)

    this.closeScheduleModal()
  }

  submitSetSchedule(e) {
    e.preventDefault()
    let startDay = this.state.value[0],
        endDay = this.state.value[1],
        startTime = this.setSceduleForm.startTime.value,
        endTime = this.setSceduleForm.endTime.value,
        range = moment.range(startDay, endDay),
        driver = this.props.currentDriver.data,
        workSchedule = driver.work_schedule.id,
        workdays = driver.work_schedule.workdays,
        newWorkdays = []

    for (let day of range.by('days')) { 
      newWorkdays.push({
        date: day.format('DD.MM.YYYY'),
        start: startTime,
        end: endTime,
      }) 
    }

    workdays.push(...newWorkdays)

    this.props.setSchedule(newWorkdays, workSchedule)

    this.closeSetScheduleModal()
  }

  render() {
    const calendar = (
      <RangeCalendar
        hoverValue={this.state.hoverValue}
        onHoverChange={this.onHoverChange}
        format={formatStr}
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        disabledDate={disabledDate}
        locale={cn ? zhCN : enUS}
      />
    )

    return (
      <div className="content-wrap schedule">
        {!this.props.currentDriver.isFetched ? (
          <img className="spinner" src={spinner} />
        ) : (
          <div className="content">
            <FullCalendar
              Select={Select}
              fullscreen
              onSelect={this.onSelect.bind(this)}
              type={this.state.type}
              onTypeChange={this.onTypeChange.bind(this)}
              locale={cn ? zhCN : enUS}
              dateCellRender={(m) => this.renderDate(m)}
            />
         
            <div className="btn-wrap">
              <button className="button left" onClick={() => this.openSetScheduleModal()}>Set scedule</button>
            </div>
      
            <Modal
              isOpen={this.state.scheduleModalIsOpen}
              onRequestClose={this.closeScheduleModal}
              style={{overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: "1000" }}}
              className="modal"
              ariaHideApp={false}
            > 
              {this.getDayOfSchedule()}             
            </Modal>
           
            <Modal
              isOpen={this.state.setScheduleModalIsOpen}
              onRequestClose={this.closeSetScheduleModal}
              style={{ overlay: { background: 'rgba(0, 0, 0, 0.12)', zIndex: '1000' } }}
              className="modal"
              ariaHideApp={false}
            >
              <form ref={form => this.setSceduleForm = form}  onSubmit={(e) => this.submitSetSchedule(e)}>
                <button type="reset" className="close-btn" onClick={this.closeSetScheduleModal} />
                <label>Work days: <Picker
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
                          readOnly
                          type="text"
                          value={isValidRange(value) && `${format(value[0])} - ${format(value[1])}` || ''}
                        />
                      );
                    }
                  }
                </Picker></label>
                <label>Work day start:  <input type="time" name="startTime" required/></label>
                <label>Work day end:  <input type="time" name="endTime" required/></label>
                <div className="btn-wrap">
                  <button type="submit" className="button small">Принять</button>
                  <button type="recet" className="button small" onClick={this.closeSetScheduleModal}>Отмена</button>
                </div>
              </form>
            </Modal>   
          </div>
        )}
      </div>
    );
  }
}