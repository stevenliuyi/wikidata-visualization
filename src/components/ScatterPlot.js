import React, { Component } from 'react'
import DataCircles from './DataCircles'
import Labels from './Labels'
import XYAxis from './XYAxis'
import { getXYScales, getRadius, getColors } from '../utils/scales'

class ScatterPlot extends Component {
  render() {
    const [scales, xLabel, yLabel] = getXYScales(this.props)
    const radii = getRadius(this.props)
    const colors = getColors(this.props)

    return (
      <svg width={this.props.width} height={this.props.height}>
        <DataCircles
          xLabel={xLabel}
          yLabel={yLabel}
          radii={radii}
          colors={colors}
          {...this.props}
          {...scales} />
        { this.props.settings['label'] !== -1 &&
          <Labels xLabel={xLabel} yLabel={yLabel} {...this.props} {...scales} />
        }
        <XYAxis {...this.props} {...scales} />
      </svg>
    )
  }
}

export default ScatterPlot
