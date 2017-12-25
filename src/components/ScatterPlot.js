import React, { Component } from 'react';
import * as d3 from 'd3';
import DataCircles from './DataCircles';
import Labels from './Labels'
import XYAxis from './XYAxis'

class ScatterPlot extends Component {
  render() {
    const xLabel = this.props.header[this.props.settings['x-axis']]
    const yLabel = this.props.header[this.props.settings['y-axis']]
    const xMin = d3.min(this.props.data, d => d[xLabel])
    const yMin = d3.min(this.props.data, d => d[yLabel])
    const xMax = d3.max(this.props.data, d => d[xLabel])
    const yMax = d3.max(this.props.data, d => d[yLabel])
    
    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([this.props.padding, this.props.width-this.props.padding*2])
    
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([this.props.height-this.props.padding, this.props.padding])

    const scales = {
      xScale: xScale,
      yScale: yScale
    }

    return (
      <svg width={this.props.width} height={this.props.height}>
        <DataCircles xLabel={xLabel} yLabel={yLabel} {...this.props} {...scales} />
        { this.props.settings['label'] !== -1 &&
          <Labels xLabel={xLabel} yLabel={yLabel} {...this.props} {...scales} />
        }
        <XYAxis {...this.props} {...scales} />
      </svg>
    )
  }
}

export default ScatterPlot
