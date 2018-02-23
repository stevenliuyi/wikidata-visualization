import React, { Component } from 'react'
import DataCircles from './DataCircles'
import Labels from './Labels'
import XYAxis from './XYAxis'
import { getXYScales, getRadius, getColors } from '../utils/scales'
import { getTooltipHTML } from '../utils/convertData'
import SVGPanZoom from './SVGPanZoom'
import * as d3 from 'd3'
import chroma from 'chroma-js'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import Info from './Info'

class ScatterPlot extends Component {
  render() {
    if (
      !this.props.dataTypes.includes('number') &&
      !this.props.dataTypes.includes('time')
    )
      return <Info info="no-number" text="scatter chart" />

    const [scales, xLabel, yLabel] = getXYScales(this.props)
    const radii = getRadius(this.props)
    const [colors, colorScale] = getColors(this.props, true)
    const tooltipHTMLs = getTooltipHTML(this.props)

    d3.selectAll('.d3ToolTip').remove()
    var tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3ToolTip')

    let selectedData = this.props.data
      .filter((item, i) => this.props.rowSelections.includes(i))
      .map((item, i) => ({ id: i, ...item })) // add ids
      .filter(item => item[xLabel] != null && item[yLabel] != null) // remove undefined values

    // add tooltips
    d3
      .selectAll('.circle')
      .data(selectedData)
      .on('mouseover', function(d) {
        d3
          .select('#circle' + d.id)
          .attr('fill', chroma(colors[d.id]).brighten(0.6))
        d3.select('#text' + d.id).attr('font-weight', 'bold')
        drawTooltip(tooltipHTMLs[d.id])
      })
      .on('mousemove', function() {
        updateTooltip()
      })
      .on('mouseout', function(d) {
        tooltip.style('display', 'none')
        d3.select('#circle' + d.id).attr('fill', colors[d.id])
        d3.select('#text' + d.id).attr('font-weight', 'normal')
      })

    d3
      .selectAll('.circleLabel')
      .data(selectedData)
      .on('mouseover', function(d) {
        d3
          .select('#circle' + d.id)
          .attr('fill', chroma(colors[d.id]).brighten(0.6))
        d3.select('#text' + d.id).attr('font-weight', 'bold')
        drawTooltip(tooltipHTMLs[d.id])
      })
      .on('mousemove', function() {
        updateTooltip()
      })
      .on('mouseout', function(d) {
        tooltip.style('display', 'none')
        d3.select('#circle' + d.id).attr('fill', colors[d.id])
        d3.select('#text' + d.id).attr('font-weight', 'normal')
      })

    // add legend
    d3.selectAll('.legendCells').remove()
    var svg = d3.select('#chart').select('g')
    drawLegend(svg, colorScale, this.props)

    return (
      <div id="chart">
        <SVGPanZoom {...this.props}>
          <svg width={this.props.width} height={this.props.height}>
            <XYAxis {...this.props} {...scales} />
            <DataCircles
              xLabel={xLabel}
              yLabel={yLabel}
              radii={radii}
              colors={colors}
              {...this.props}
              {...scales}
            />
            <Labels
              xLabel={xLabel}
              yLabel={yLabel}
              {...this.props}
              {...scales}
            />
          </svg>
        </SVGPanZoom>
      </div>
    )
  }
}

export default ScatterPlot
