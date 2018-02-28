import React, { Component } from 'react'
import * as d3 from 'd3'

class Gridlines extends Component {
  componentDidMount() {
    this.renderAxis()
  }

  componentDidUpdate() {
    this.renderAxis()
  }

  renderAxis() {
    let axis = null
    if (this.props.orient === 'bottom') {
      axis = d3
        .axisBottom(this.props.scale)
        .tickSize(-(this.props.height - this.props.padding * 2))
        .ticks(this.props.axisSettings.xticks)
        .tickFormat('')
    } else if (this.props.orient === 'left') {
      axis = d3
        .axisLeft(this.props.scale)
        .tickSize(-(this.props.width - this.props.padding * 3))
        .ticks(this.props.axisSettings.yticks)
        .tickFormat('')
    }
    let node = this.refs.axis
    d3.select(node).call(axis)

    d3
      .selectAll('.gridline line')
      .style('stroke', '#ddd')
      .style('stroke-opacity', 0.7)
      .style('shape-rendering', 'crispEdges')

    d3.selectAll('.gridline path').style('stroke-width', 0)

    d3.selectAll('.axis path').style('display', 'none')
  }

  render() {
    return (
      <g className="gridline" ref="axis" transform={this.props.translate} />
    )
  }
}

export default Gridlines
