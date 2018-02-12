import React, { Component } from 'react'
import { getFormat } from '../utils/format'
import * as d3 from 'd3'

class Axis extends Component {
  componentDidMount() {
    this.renderAxis()
  }

  componentDidUpdate() {
    this.renderAxis()
  }

  renderAxis() {
    const xFormat = getFormat(this.props.axisSettings.xformat, this.props.axisSettings.xprecision)
    const yFormat = getFormat(this.props.axisSettings.yformat, this.props.axisSettings.yprecision)

    let axis = null
    if (this.props.orient === 'bottom') {
      axis = d3.axisBottom(this.props.scale).ticks(5).tickFormat(xFormat)
    } else if (this.props.orient === 'left') {
      axis = d3.axisLeft(this.props.scale).ticks(5).tickFormat(yFormat)
    }
    let node = this.refs.axis
    d3.select(node).call(axis)
  }

  render() {
    return (
      <g className="axis"
        ref="axis"
        transform={this.props.translate} />
    )
  }
}

export default Axis
