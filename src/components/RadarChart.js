import React, { Component } from 'react'
import { getGroupValues } from '../utils/convertData'
import * as d3 from 'd3'
import SVGPanZoom from './SVGPanZoom'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import Radar from 'react-d3-radar'
import Info from './Info'
import { getFormat } from '../utils/format'
import chroma from 'chroma-js'

class RadarChart extends Component {
  componentDidUpdate() {
    const tooltipHTMLs = getGroupValues(this.props)[4]

    var tooltip = d3.select('.d3ToolTip')

    d3
      .selectAll('.circle')
      .on('mouseover', function() {
        const id = d3
          .select(this)
          .attr('class')
          .slice(13)
        const color = d3.select(this).attr('fill')
        d3.select(this).attr('fill', chroma(color).brighten(0.6))
        d3.select('#text' + id).attr('font-weight', 'bold')
        drawTooltip(tooltipHTMLs[parseInt(id, 10)])
      })
      .on('mousemove', function() {
        updateTooltip()
      })
      .on('mouseout', function() {
        tooltip.style('display', 'none')
        const id = d3
          .select(this)
          .attr('class')
          .slice(13)
        const color = d3.select(this).attr('fill')
        d3.select(this).attr('fill', chroma(color).darken(0.6))
        d3.select('#text' + id).attr('font-weight', 'normal')
      })

    d3
      .selectAll('.text')
      .on('mouseover', function() {
        const id = parseInt(
          d3
            .select(this)
            .attr('id')
            .slice(4),
          10
        )
        drawTooltip(tooltipHTMLs[id])
        d3.select(this).attr('font-weight', 'bold')
      })
      .on('mousemove', function() {
        updateTooltip()
      })
      .on('mouseout', function() {
        tooltip.style('display', 'none')
        d3.select(this).attr('font-weight', 'normal')
      })
  }

  render() {
    if (
      !this.props.dataTypes.includes('number') &&
      !this.props.dataTypes.includes('time')
    )
      return <Info info="no-number" text="radar chart" />

    const [data, maxVal, colors, colorScale] = getGroupValues(this.props)

    if (data.variables.length < 1) return null

    d3.selectAll('.legendCells').remove()
    drawLegend(d3.select('#chart').select('svg'), colorScale, this.props)

    d3.selectAll('.d3ToolTip').remove()
    d3
      .select('body')
      .append('div')
      .attr('class', 'd3ToolTip')

    return (
      <div id="chart">
        <SVGPanZoom {...this.props}>
          <Radar
            width={this.props.width}
            height={this.props.height}
            padding={70}
            domainMax={maxVal}
            data={data}
            colors={colors}
            numRings={this.props.axisSettings.ticks}
            format={getFormat(
              this.props.axisSettings.format,
              this.props.axisSettings.precision
            )}
            fontSize={this.props.moreSettings.fontSize}
          />
        </SVGPanZoom>
      </div>
    )
  }
}

export default RadarChart
