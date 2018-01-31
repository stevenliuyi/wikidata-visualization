import React, { Component } from 'react'
import { getColorScale } from '../utils/scales'
import { getTooltipHTML } from '../utils/convertData'
import * as d3 from 'd3'
import SVGPanZoom from './SVGPanZoom'
import chroma from 'chroma-js'
import{ drawLegend } from '../utils/draw'

// bubble chart d3 references
// https://bl.ocks.org/mbostock/4063269
// https://jrue.github.io/coding/2014/exercises/basicbubblepackchart/
const updateD3Node = (props) => {
  var colorScale = getColorScale(props)
  var tooltipHTML = getTooltipHTML(props)
  
  var bubble = d3.pack()
    .size([props.width, props.height])
    .padding(5)
  
  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()
  svg = svg.append('g')
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('class', 'bubble')

  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3.select('body').append('div').attr('class', 'd3ToolTip')
  
  var data = props.data.filter((item, i) => props.rowSelections.includes(i))
    .map((d, index) => { d.id = index; return d })
  data = data.filter((d) => (d[props.header[props.settings['radius']]] != null))
  
  // use maximum radius to scale the radii to avoid bubble overlap issue for very small values
  const maxRadius = Math.max(...data.map(d => d[props.header[props.settings['radius']]]))
  //bubbles needs very specific format, convert data to this.
  var nodes = d3.hierarchy({children:data})
    .sum(function(d) { return d[props.header[props.settings['radius']]]/maxRadius })
    .sort(function(a,b) { return b.value - a.value })
  
  //setup the chart
  var bubbles = svg.selectAll('.node')
    .data(bubble(nodes).leaves())
    .enter().append('g')
    .attr('class','node')
    .attr('transform', function(d) {return `translate(${d.x},${d.y})`})
    .on('mouseover', function(d) {
      d3.select(`#circle${d.data.id}`)
        .attr('fill', chroma(colorScale(d.data[props.header[props.settings['color']]])).brighten(0.6))
      d3.select(`#text${d.data.id}`)
        .attr('font-weight', 'bold')
    })
    .on('mouseout', function(d) {
      d3.select(`#circle${d.data.id}`)
        .attr('fill', function() { return colorScale(d.data[props.header[props.settings['color']]]) })
      d3.select(`#text${d.data.id}`)
        .attr('font-weight', 'normal')
    })
  
  //create the bubbles
  bubbles.append('circle')
    .attr('id', function(d){ return 'circle' + d.data['id'] })
    .attr('r', function(d){ return d.r })
    .attr('fill', function(d) { return colorScale(d.data[props.header[props.settings['color']]]) })
    .on('mousemove', function(d) {
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY + 10 + 'px')
        .style('display', 'inline-block')
        .html(tooltipHTML[d.data.id])
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none')
    })
  
  bubbles.append('clipPath')
    .attr('id', function(d) { return 'clip-circle' + d.data['id'] })
    .append('circle') // workaround fix for display bug in Safari: use the actual circle instead of 'use' element
    .attr('r', function(d){ return d.r })
    //.append('use')
    //.attr('xlink:href', function(d) { return '#circle' + d.data['id'] })

  //format the text for each bubble
  bubbles.append('text')
    .attr('id', function(d){ return 'text' + d.data['id'] })
    .attr('clip-path', function(d) { return 'url(#clip-circle' + d.data['id'] + ')'})
    .attr('x', 0)
    .attr('y', 0)
    .text(function(d){ return d.data[props.header[props.settings['label']]] })
    .style('font-family', 'sans-serif')
    .style('font-size', props.moreSettings.fontSize)
    .style('text-anchor', 'middle')
    .on('mousemove', function(d) {
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY + 10 + 'px')
        .style('display', 'inline-block')
        .html(tooltipHTML[d.data.id])
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none')
    })

  drawLegend(svg, colorScale, props)
} 

class BubbleChart extends Component {

  state = {
    mounted: false
  }

  componentDidMount() {
    updateD3Node(this.props)
    this.setState({mounted: true})
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.mounted) updateD3Node(nextProps)
  }

  render() {
    let d3node = (<svg width={this.props.width} height={this.props.height}></svg>)

    return (
      <div id='chart'>
        <SVGPanZoom d3node={d3node} {...this.props}/> 
      </div>
    )
  }
}

export default BubbleChart
