import React, { Component } from 'react'
import Axis from './Axis'

class XYAxis extends Component {
  render() {
    const xSettings = {
      translate: `translate(0, ${this.props.height-this.props.padding})`,
      scale: this.props.xScale,
      orient: 'bottom'
    }

    const ySettings = {
      translate: `translate(${this.props.padding}, 0)`,
      scale: this.props.yScale,
      orient: 'left'
    }

    return (
      <g className="xy-axis">
        <Axis {...xSettings} />
        <Axis {...ySettings} />
      </g>
    )
  }
}

export default XYAxis
