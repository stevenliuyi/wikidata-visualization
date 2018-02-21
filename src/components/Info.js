import React, { Component } from 'react'
import { Well } from 'react-bootstrap'
import { info } from '../utils/info'
import MdInfoOutline from 'react-icons/lib/md/info-outline'

const iconStyle = {
  verticalAlign: 'bottom'
}

class Info extends Component {
  render() {
    const showSettings =
      this.props.showSettings != null ? this.props.showSettings : false

    const infoText =
      this.props.text == null
        ? info[this.props.info]
        : info[this.props.info].replace(/\[TEXT\]/, this.props.text)

    return (
      <div className="grey-text">
        {!showSettings && (
          <Well className="info-text">
            <MdInfoOutline size={20} style={iconStyle} /> {infoText}
          </Well>
        )}
        {showSettings && (
          <Well className="info-text show-settings">
            <MdInfoOutline size={20} style={iconStyle} /> {infoText}
          </Well>
        )}
      </div>
    )
  }
}

export default Info
