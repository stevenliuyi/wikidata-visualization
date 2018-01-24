import React, { Component } from 'react'
import * as d3 from 'd3'
import { getTreeRoot } from '../utils/convertData'
import { getColorScale } from '../utils/scales'
import ReactFauxDOM from 'react-faux-dom'
import SVGPanZoom from './SVGPanZoom'

// tree d3 reference: https://bl.ocks.org/mbostock/4339184
const getD3Node = (props) => {

  var colorScale = getColorScale(props)
  
  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3.select('body').append('div').attr('class', 'd3ToolTip')

  var d3node = new ReactFauxDOM.Element('svg')

  var svg = d3.select(d3node)
    .attr('width', props.width)
    .attr('height', props.height)
    .append('g')
    .attr('transform', 'translate(40,0)')
    .attr('font-family', 'sans-serif')
    .attr('font-size', props.moreSettings.fontSize)
  
  var cluster = d3.cluster()
    .size([props.height, props.width-160])

  var tree = d3.tree()
    .size([props.height, props.width-160])
  
  var linkHorizontal = d3.linkHorizontal()
    .x(function(d) { return d.y })
    .y(function(d) { return d.x })

  // convert data to d3 hierarchy format
  var root = getTreeRoot(props)
  if (root) {
    root = (props.treeType === 'cluster') ? cluster(root) : tree(root)
  } else { // null returned, error encountered while generating tree
    return d3node.toReact()
  }
  
  // define link between nodes
  svg.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .style('fill', 'none')
    .style('stroke', '#555')
    .style('stroke-opacity', '0.5')
    .style('stroke-width', '1.5')
    .attr('d', linkHorizontal)

  // define node
  var node = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + d.y + ',' + d.x + ')'
    })

  // add circles
  node.append('circle')
    .attr('r', 4)
    .style('fill', function(d) { return colorScale(d.data.color) })
    .on('mousemove', function(d) {
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY + 10 + 'px')
        .style('display', 'inline-block')
        .html(d.data.tooltipHTML)
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none')
    })

  // add labels
  node.append('text')
    .attr('dy', '0.3em')
    .attr('x', function(d) { return d.children ? -8 : -8 })
    .attr('text-anchor', function(d) { return d.children ? 'end' : 'start' })
    .text(function (d) { return d.data.label })
    .on('mousemove', function(d) {
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY + 10 + 'px')
        .style('display', 'inline-block')
        .html(d.data.tooltipHTML)
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none')
    })

  return d3node.toReact()
} 

class Tree extends Component {

  render() {
    const d3node = getD3Node(this.props)
    return (
      <SVGPanZoom d3node={d3node} width={this.props.width} height={this.props.height} /> 
    )
  }
}

export default Tree
