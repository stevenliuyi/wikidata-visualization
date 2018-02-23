import React, { Component } from 'react'
import { getValues } from '../utils/convertData'
import * as d3 from 'd3'
import SVGPanZoom from './SVGPanZoom'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import chroma from 'chroma-js'
import Info from './Info'

// pie/donut chart d3 reference: https://bl.ocks.org/mbostock/3887193
const updateD3Node = (props, transition) => {
  const [data, colors, colorScale, tooltipHTMLs] = getValues(props)

  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3ToolTip')

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()
  svg = svg
    .append('g')
    .attr('width', props.width)
    .attr('height', props.height)

  var g = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + props.width / 2 + ',' + props.height / 2 + ')'
    )

  var radius = Math.min(props.width, props.height) / 2 * 0.8

  var pie = d3
    .pie()
    .sort(null)
    .value(function(d) {
      return d.value
    })

  var path = d3
    .arc()
    .outerRadius(radius)
    .innerRadius(radius * props.moreSettings.innerRadius * 0.01)

  var arc = g
    .selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc')

  arc
    .append('path')
    .attr('id', function(d, i) {
      return 'path' + i
    })
    .attr('d', path)
    .attr('fill', function(d, i) {
      return colors[i]
    })
    .on('mouseover', function(d, i) {
      d3.select('#path' + i).attr('fill', chroma(colors[i]).brighten(0.6))
      d3.select('#text' + i).attr('font-weight', 'bold')
      drawTooltip(tooltipHTMLs[i])
    })
    .on('mousemove', function() {
      updateTooltip()
    })
    .on('mouseout', function(d, i) {
      tooltip.style('display', 'none')
      d3.select('#path' + i).attr('fill', colors[i])
      d3.select('#text' + i).attr('font-weight', 'normal')
    })

  arc
    .append('clipPath')
    .attr('id', function(d, i) {
      return 'clip-path' + i
    })
    .append('path') // workaround fix for display bug in Safari: use the actual circle instead of 'use' element
    .attr('d', path)

  arc
    .append('g')
    .attr('clip-path', function(d, i) {
      return 'url(#clip-path' + i + ')'
    })
    .append('text')
    .attr('id', function(d, i) {
      return 'text' + i
    })
    .attr('transform', function(d) {
      return 'translate(' + path.centroid(d) + ')'
    })
    .style('text-anchor', 'middle')
    .style('font-size', props.moreSettings.fontSize)
    .attr('dy', '0.35em')
    .text(function(d) {
      return d.data.label
    })
    .on('mouseover', function(d, i) {
      d3.select('#path' + i).attr('fill', chroma(colors[i]).brighten(0.6))
      d3.select('#text' + i).attr('font-weight', 'bold')
      drawTooltip(tooltipHTMLs[i])
    })
    .on('mousemove', function() {
      updateTooltip()
    })
    .on('mouseout', function(d, i) {
      tooltip.style('display', 'none')
      d3.select('#path' + i).attr('fill', colors[i])
      d3.select('#text' + i).attr('font-weight', 'normal')
    })

  arc
    .append('path')
    .attr('d', path)
    .attr('fill', 'none')
    .style('stroke', '#fff')
    .style('stroke-width', 2)

  if (colorScale != null) drawLegend(svg, colorScale, props)
}

class PieChart extends Component {
  state = {
    mounted: false
  }

  componentDidMount() {
    updateD3Node(this.props)
    this.setState({ mounted: true })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.mounted) updateD3Node(nextProps)
  }

  render() {
    if (
      !this.props.dataTypes.includes('number') &&
      !this.props.dataTypes.includes('time')
    )
      return <Info info="no-number" text="pie chart" />

    return (
      <div id="chart">
        <SVGPanZoom {...this.props}>
          <svg width={this.props.width} height={this.props.height} />
        </SVGPanZoom>
      </div>
    )
  }
}

export default PieChart
