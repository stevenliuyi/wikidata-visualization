import React, { Component } from 'react'
import Axis from './Axis'
import Gridlines from './Gridlines'

class XYAxis extends Component {
  render() {
    const xSettings = {
      translate: `translate(0, ${this.props.height - this.props.padding})`,
      scale: this.props.xScale,
      orient: 'bottom'
    }

    const ySettings = {
      translate: `translate(${this.props.padding}, 0)`,
      scale: this.props.yScale,
      orient: 'left'
    }

    return (
      <g>
        <g>
          {this.props.axisSettings.xgridlines && (
            <Gridlines {...xSettings} {...this.props} />
          )}
          {this.props.axisSettings.ygridlines && (
            <Gridlines {...ySettings} {...this.props} />
          )}
        </g>
        <g className="xy-axis">
          <Axis {...xSettings} {...this.props} />
          <Axis {...ySettings} {...this.props} />
        </g>
      </g>
    )
  }
}

export default XYAxis
