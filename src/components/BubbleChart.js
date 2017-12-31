import React, { Component } from 'react'
import { getColorScale } from '../utils/scales'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'
import SVGPanZoom from './SVGPanZoom'

// bubble chart d3 references
// https://bl.ocks.org/mbostock/4063269
// https://jrue.github.io/coding/2014/exercises/basicbubblepackchart/
const getD3Node = (props) => {
  var colorScale =getColorScale(props)
  
  var bubble = d3.pack()
    .size([props.width, props.height])
    .padding(5)
  
  var d3node = new ReactFauxDOM.Element('svg')

  var svg = d3.select(d3node)
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('class', 'bubble')
  
  var data = props.data.filter((item, i) => props.rowSelections.includes(i))
    .map((d, index) => { d.id = index; return d })
  
  //bubbles needs very specific format, convert data to this.
  var nodes = d3.hierarchy({children:data})
    .sum(function(d) { return d[props.header[props.settings['radius']]] })
  
  //setup the chart
  var bubbles = svg.selectAll('.node')
    .data(bubble(nodes).leaves())
    .enter().append('g')
    .attr('class','node')
    .attr('transform', function(d) {return `translate(${d.x},${d.y})`})
  
  //create the bubbles
  bubbles.append('circle')
    .attr('id', function(d){ return d.data['id'] })
    .attr('r', function(d){ return d.r })
    .style('fill', function(d) { return colorScale(d.data[props.header[props.settings['color']]]) })
  
  bubbles.append('clipPath')
    .attr('id', function(d) { return 'clip-' + d.data['id'] })
    .append('use')
    .attr('xlink:href', function(d) { return '#' + d.data['id'] })

  //format the text for each bubble
  bubbles.append('text')
    .attr('clip-path', function(d) { return 'url(#clip-' + d.data['id'] + ')'})
    .attr('x', 0)
    .attr('y', 0)
    .text(function(d){ return d.data[props.header[props.settings['label']]] })
    .style('font-family', 'sans-serif')
    .style('font-size', '10')
    .style('text-anchor', 'middle')

  return d3node.toReact()
} 

class BubbleChart extends Component {

  render() {
    const d3node = getD3Node(this.props)
    return (
      <SVGPanZoom d3node={d3node} width={this.props.width} height={this.props.height} /> 
    )
  }
}

export default BubbleChart
