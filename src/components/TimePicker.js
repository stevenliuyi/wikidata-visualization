import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

const dateFormats = [
  'YYYY/MM/DD',
  'YYYY/M/D',
  'YY/MM/DD',
  'YY/M/D',
  'MM/DD/YYYY',
  'M/D/YYYY',
  'MM/DD/YY',
  'M/D/YY',
  'YYYY',
  'YYYY-MM-DD',
  'YYYY-M-D',
  'YY-MM-DD',
  'YY-M-D',
  'DD-MM-YYYY',
  'D-M-YYYY',
  'DD-MM-YY',
  'D-M-YY'
]

class TimePicker extends Component {
  render() {
    return (
      <DatePicker
        {...this.props}
        dateFormat={dateFormats}
        minDate={moment('0000-01-01')}
        maxDate={moment('2100-12-31')}
        popperModifiers={{
          preventOverflow: {
            enabled: true,
            escapeWithReference: false,
            boundariesElement: document.getElementsByClassName('ReactTable')[0]
          }
        }}
      />
    )
  }
}

export default TimePicker
