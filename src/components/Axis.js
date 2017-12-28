import React, { Component } from 'react'
import * as d3 from 'd3'

class Axis extends Component {
  componentDidMount() {
    this.renderAxis()
  }

  componentDidUpdate() {
    this.renderAxis()
  }

  renderAxis() {
    let axis = null
    if (this.props.orient === 'bottom') {
      axis = d3.axisBottom(this.props.scale).ticks(5).tickFormat(d3.format('.1e'))
    } else if (this.props.orient === 'left') {
      axis = d3.axisLeft(this.props.scale).ticks(5).tickFormat(d3.format('.1e'))
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
