import React, { Component } from 'react'
import { getFormat, timeFormats } from '../utils/format'
import * as d3 from 'd3'

class Axis extends Component {
  componentDidMount() {
    this.renderAxis()
  }

  componentDidUpdate() {
    this.renderAxis()
  }

  renderAxis() {
    const xFormat =
      this.props.dataTypes[this.props.settings['x-axis']] === 'number'
        ? getFormat(
            this.props.axisSettings.xformat,
            this.props.axisSettings.xprecision
          )
        : d3.timeFormat(timeFormats[this.props.axisSettings.xtimeprecision])
    const yFormat =
      this.props.dataTypes[this.props.settings['y-axis']] === 'number'
        ? getFormat(
            this.props.axisSettings.yformat,
            this.props.axisSettings.yprecision
          )
        : d3.timeFormat(timeFormats[this.props.axisSettings.ytimeprecision])

    let axis = null
    if (this.props.orient === 'bottom') {
      axis = d3
        .axisBottom(this.props.scale)
        .ticks(this.props.axisSettings.xticks)
        .tickFormat(xFormat)
    } else if (this.props.orient === 'left') {
      axis = d3
        .axisLeft(this.props.scale)
        .ticks(this.props.axisSettings.yticks)
        .tickFormat(yFormat)
    }
    let node = this.refs.axis
    d3.select(node).call(axis)
  }

  render() {
    return <g className="axis" ref="axis" transform={this.props.translate} />
  }
}

export default Axis
