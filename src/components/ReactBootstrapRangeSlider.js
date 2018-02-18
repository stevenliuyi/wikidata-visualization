// separate from ReactBootstrapSlider to avoid error when React updates components

import React, { Component } from 'react'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css'

class ReactBootstrapRangeSlider extends Component {
  render() {
    return <ReactBootstrapSlider {...this.props} />
  }
}

export default ReactBootstrapRangeSlider
