import React, { Component } from 'react'
import * as d3 from 'd3'
import { getMatrix } from '../utils/convertData'
import SVGPanZoom from './SVGPanZoom'
import chroma from 'chroma-js'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import Info from './Info'

// chord diagram d3 reference: https://bl.ocks.org/mbostock/4062006
const updateD3Node = props => {
  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3ToolTip')

  var [matrix, colorScale, colors, labels, tooltipHTMLs] = getMatrix(props)

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()
  svg = svg
    .append('g')
    .attr('width', props.width)
    .attr('height', props.height)

  var outerRadius = Math.min(props.width, props.height) * 0.5 - 40,
    innerRadius = outerRadius * props.moreSettings.innerRadius * 0.01

  // make sure the radius is positive
  if (innerRadius <= 0) return null

  var chord = d3
    .chord()
    .padAngle(props.moreSettings.padAngle * 0.01)
    .sortSubgroups(d3.descending)

  var arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

  var ribbon = d3.ribbon().radius(innerRadius)

  var g = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + props.width / 2 + ',' + props.height / 2 + ')'
    )
    .datum(chord(matrix))

  var group = g
    .append('g')
    .attr('class', 'groups')
    .selectAll('g')
    .data(function(chords) {
      return chords.groups
    })
    .enter()
    .append('g')
    .on('mouseover', function(d) {
      d3
        .select('#arc' + d.index)
        .attr('fill', chroma(colors[d.index]).brighten(0.6))
      d3.select('#text' + d.index).attr('font-weight', 'bold')
    })
    .on('mouseout', function(d) {
      d3.select('#arc' + d.index).attr('fill', colors[d.index])
      d3.select('#text' + d.index).attr('font-weight', 'normal')
    })

  group
    .append('path')
    .attr('id', function(d) {
      return 'arc' + d.index
    })
    .attr('fill', function(d) {
      return colors[d.index]
    })
    .style('stroke', function(d) {
      return d3.rgb(colors[d.index]).darker()
    })
    .attr('d', arc)

  group
    .append('g')
    .attr('transform', function(d) {
      return (
        'rotate(' +
        ((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90) +
        ') translate(' +
        outerRadius +
        ',0)'
      )
    })
    .append('text')
    .attr('id', function(d) {
      return 'text' + d.index
    })
    .attr('x', 6)
    .attr('transform', function(d) {
      return (d.startAngle + d.endAngle) / 2 > Math.PI
        ? 'rotate(180) translate(-12)'
        : null
    })
    .text(function(d) {
      return labels[d.index]
    })
    .style('text-anchor', function(d) {
      return (d.startAngle + d.endAngle) / 2 > Math.PI ? 'end' : null
    })
    .style('font-size', props.moreSettings.fontSize)

  g
    .append('g')
    .attr('class', 'ribbons')
    .selectAll('path')
    .data(function(chords) {
      return chords
    })
    .enter()
    .append('path')
    .attr('d', ribbon)
    .attr('id', function(d, i) {
      return 'ribbon' + i
    })
    .attr('fill', function(d) {
      return colors[d.target.index]
    })
    .style('stroke', function(d) {
      return d3.rgb(colors[d.target.index]).darker()
    })
    .on('mouseover', function(d, i) {
      d3
        .select('#ribbon' + i)
        .attr('fill', chroma(colors[d.target.index]).brighten(0.6))
      d3
        .select('#arc' + d.target.index)
        .attr('fill', chroma(colors[d.target.index]).brighten(0.6))
      d3.select('#text' + d.target.index).attr('font-weight', 'bold')
      d3
        .select('#arc' + d.source.index)
        .attr('fill', chroma(colors[d.source.index]).brighten(0.6))
      d3.select('#text' + d.source.index).attr('font-weight', 'bold')
      drawTooltip(tooltipHTMLs[d.source.index][d.target.index])
    })
    .on('mousemove', function() {
      updateTooltip()
    })
    .on('mouseout', function(d, i) {
      d3.select('#ribbon' + i).attr('fill', colors[d.target.index])
      d3.select('#arc' + d.target.index).attr('fill', colors[d.target.index])
      d3.select('#text' + d.target.index).attr('font-weight', 'normal')
      d3.select('#arc' + d.source.index).attr('fill', colors[d.source.index])
      d3.select('#text' + d.source.index).attr('font-weight', 'normal')

      tooltip.style('display', 'none')
    })

  drawLegend(svg, colorScale, props)
}

class ChordDiagram extends Component {
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
    if (!this.props.dataTypes.includes('item'))
      return <Info info="no-item" text="chord diagram" />
    if (
      !this.props.dataTypes.includes('number') &&
      !this.props.dataTypes.includes('time')
    )
      return <Info info="no-number" text="chord diagram" />

    return (
      <div id="chart">
        <SVGPanZoom {...this.props}>
          <svg width={this.props.width} height={this.props.height} />
        </SVGPanZoom>
      </div>
    )
  }
}

export default ChordDiagram
