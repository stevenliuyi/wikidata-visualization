import React, { Component } from 'react'
import * as d3 from 'd3'
import { getMatrix } from '../utils/convertData'
import ReactFauxDOM from 'react-faux-dom'
import SVGPanZoom from './SVGPanZoom'
import chroma from 'chroma-js'

// chord diagram d3 reference: https://bl.ocks.org/mbostock/4062006
const getD3Node = (props) => {

  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3.select('body').append('div').attr('class', 'd3ToolTip')

  var d3node = new ReactFauxDOM.Element('svg')
  
  var [matrix, colors, labels, tooltipHTMLs] = getMatrix(props)

  var svg = d3.select(d3node)
    .attr('width', props.width)
    .attr('height', props.height)

  var outerRadius = Math.min(props.width, props.height) * 0.5 - 40,
    innerRadius = outerRadius * 0.8

  // make sure the radius is positive
  if (innerRadius <= 0) return d3node.toReact()
  
  var chord = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending)
  
  var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
  
  var ribbon = d3.ribbon()
    .radius(innerRadius)
  
  var g = svg.append('g')
    .attr('transform', 'translate(' + props.width / 2 + ',' + props.height / 2 + ')')
    .datum(chord(matrix))
  
  var group = g.append('g')
    .attr('class', 'groups')
    .selectAll('g')
    .data(function(chords) { return chords.groups })
    .enter().append('g')
    .on('mouseover', function(d) {
      d3.select('#arc'+d.index)
        .attr('fill', chroma(colors[d.index]).brighten(0.6))
      d3.select('#text'+d.index)
        .attr('font-weight', 'bold')
    })
    .on('mouseout', function(d) {
      d3.select('#arc'+d.index).attr('fill', colors[d.index])
      d3.select('#text'+d.index)
        .attr('font-weight', 'normal')
    })

  group.append('path')
    .attr('id', function(d) { return 'arc' + d.index })
    .attr('fill', function(d) { return colors[d.index] })
    .style('stroke', function(d) { return d3.rgb(colors[d.index]).darker() })
    .attr('d', arc)
    .on('mousemove', function(d) {
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY + 10 + 'px')
        .style('display', 'inline-block')
        .html(tooltipHTMLs[d.index])
    })
    .on('mouseout', function(d,i) {
      tooltip.style('display', 'none')
    })

  group.append('g')
    .attr('transform', function(d) {
      return 'rotate(' + ((d.startAngle+d.endAngle)/2 * 180 / Math.PI - 90) + ') translate(' + outerRadius + ',0)' })
    .append('text')
    .attr('id', function(d) { return 'text' + d.index })
    .attr('x', 6)
    .attr('transform', function(d) {
      return (d.startAngle+d.endAngle)/2 > Math.PI ? 'rotate(180) translate(-12)' : null
    })
    .text(function(d) { return labels[d.index] })
    .style('text-anchor', function(d) {
      return (d.startAngle+d.endAngle)/2 > Math.PI ? 'end' : null
    })
    .style('font-family', 'sans-serif')
    .style('font-size', props.moreSettings.fontSize)
    .on('mousemove', function(d) {
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY + 10 + 'px')
        .style('display', 'inline-block')
        .html(tooltipHTMLs[d.index])
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none')
    })
  
  g.append('g')
    .attr('class', 'ribbons')
    .selectAll('path')
    .data(function(chords) { return chords })
    .enter().append('path')
    .attr('d', ribbon)
    .attr('id', function(d,i) { return 'ribbon' + i })
    .attr('fill', function(d) { return colors[d.target.index] })
    .style('stroke', function(d) { return d3.rgb(colors[d.target.index]).darker() })
    .on('mouseover', function(d,i) {
      d3.select('#ribbon' + i)
        .attr('fill', chroma(colors[d.target.index]).brighten(0.6))
      d3.select('#arc' + d.target.index)
        .attr('fill', chroma(colors[d.target.index]).brighten(0.6))
      d3.select('#text' + d.target.index)
        .attr('font-weight', 'bold')
      d3.select('#arc' + d.source.index)
        .attr('fill', chroma(colors[d.source.index]).brighten(0.6))
      d3.select('#text' + d.source.index)
        .attr('font-weight', 'bold')
    })
    .on('mouseout', function(d,i) {
      d3.select('#ribbon' + i)
        .attr('fill', colors[d.target.index])
      d3.select('#arc' + d.target.index)
        .attr('fill', colors[d.target.index])
      d3.select('#text' + d.target.index)
        .attr('font-weight', 'normal')
      d3.select('#arc' + d.source.index)
        .attr('fill', colors[d.source.index])
      d3.select('#text' + d.source.index)
        .attr('font-weight', 'normal')
    })
  
  return d3node.toReact()

} 

class ChordDiagram extends Component {

  render() {
    const d3node = getD3Node(this.props)
    return (
      <SVGPanZoom d3node={d3node} {...this.props} />
    )
  }
}

export default ChordDiagram
