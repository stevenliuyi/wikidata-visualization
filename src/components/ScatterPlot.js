import React, { Component } from 'react'
import DataCircles from './DataCircles'
import Labels from './Labels'
import XYAxis from './XYAxis'
import { getXYScales, getRadius, getColors } from '../utils/scales'
import { getTooltipHTML } from '../utils/convertData'
import SVGPanZoom from './SVGPanZoom'
import * as d3 from 'd3'

class ScatterPlot extends Component {
  render() {
    const [scales, xLabel, yLabel] = getXYScales(this.props)
    const radii = getRadius(this.props)
    const colors = getColors(this.props)
    const tooltipHTMLs = getTooltipHTML(this.props)

    d3.selectAll('.d3ToolTip').remove()
    var tooltip = d3.select('body').append('div').attr('class', 'd3ToolTip')

    const d3node = (
      <svg width={this.props.width} height={this.props.height}>
        <DataCircles
          xLabel={xLabel}
          yLabel={yLabel}
          radii={radii}
          colors={colors}
          {...this.props}
          {...scales} />
        <Labels xLabel={xLabel} yLabel={yLabel} {...this.props} {...scales} />
        <XYAxis {...this.props} {...scales} />
      </svg>
    )

    // add tooltips
    d3.selectAll('.circle')
      .on('mousemove', function(d,i) {
        tooltip
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY + 10 + 'px')
          .style('display', 'inline-block')
          .html(tooltipHTMLs[i])
      })
      .on('mouseout', function(d) {
        tooltip.style('display', 'none')
      })

    d3.selectAll('.circleLabel')
      .on('mousemove', function(d,i) {
        tooltip
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY + 10 + 'px')
          .style('display', 'inline-block')
          .html(tooltipHTMLs[i])
      })
      .on('mouseout', function(d) {
        tooltip.style('display', 'none')
      })

    return (
      <SVGPanZoom d3node={d3node} width={this.props.width} height={this.props.height} /> 
    )
  }
}

export default ScatterPlot
