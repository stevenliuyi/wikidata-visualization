import React, { Component } from 'react'
import { Well } from 'react-bootstrap'
import { info } from '../utils/info'

class Info extends Component {
  render() {
    const showSettings =
      this.props.showSettings != null ? this.props.showSettings : false

    const infoText =
      this.props.text == null
        ? info[this.props.info]
        : info[this.props.info].replace(/\[TEXT\]/, this.props.text)

    return (
      <div>
        {!showSettings && <Well className="info-text">{infoText}</Well>}
        {showSettings && (
          <Well className="info-text show-settings">{infoText}</Well>
        )}
      </div>
    )
  }
}

export default Info
