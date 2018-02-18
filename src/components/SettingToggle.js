import React, { Component } from 'react'
import Toggle from 'react-bootstrap-toggle'
import 'react-bootstrap-toggle/dist/bootstrap2-toggle.css'

class SettingToggle extends Component {
  render() {
    return (
      <Toggle
        size="sm"
        height={30}
        width="100%"
        onstyle="default"
        offstyle="default"
        handlestyle="primary"
        {...this.props}
      />
    )
  }
}

export default SettingToggle
