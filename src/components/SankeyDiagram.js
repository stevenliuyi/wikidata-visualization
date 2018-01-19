import React, { Component } from 'react'
import * as d3 from 'd3'
import { getGraph } from '../utils/convertData'
import { getColorScale } from '../utils/scales'
import SVGPanZoom from './SVGPanZoom'
import { d3Sankey } from '../utils/sankey'
import toposort from 'toposort'

// Sankey diagram d3 reference: https://bl.ocks.org/ebendennis/07c361ea822d99872adffea9c7ccf19b
const updateD3Node = (props) => {

  var graph = getGraph(props, true)
  
  // remove self-pointing links
  graph.links = graph.links.filter(link => (link.source !== link.target))

  // perform topological sorting to determine if the graph is a DAG
  try {
    toposort(graph.links.map(link => ([link.source, link.target])))
  } catch(error) {
    console.log('The graph is not acyclic, cannot generate Sankey diagram!')
    return null
  }

  var colorScale = getColorScale(props, graph.nodes)

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()

  svg = svg.append('g')
    .attr('width', props.width)
    .attr('height', props.height)
    .append('g')

  // Set the sankey diagram properties
  var sankey = d3Sankey()
    .nodeWidth(props.moreSettings.nodeWidth)
    .nodePadding(props.moreSettings.nodePadding)
    .size([props.width, props.height])
  
  var path = sankey.link()
  
  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32)

  // add in the links
  var link = svg.append('g').selectAll('.link')
    .data(graph.links)
    .enter().append('path')
    .attr('class', function(d) { return 'link str' + d.index})
    .attr('d', path)
    .style('fill-opacity', 0)
    .style('stroke', function(d) { return '#ccc' })
    .style('stroke-width', function(d) { return Math.max(1, d.dy) })
    .style('stroke-opacity', 0.5)
    .on('mouseover', function(d) { if (d.index != null) {highlight('str' + d.index) }})
    .on('mouseout', function(d) { highlight(null) })
    .sort(function(a, b) { return b.dy - a.dy })

  // add the link titles
  link.append('title')
    .text(function(d) { return d.edgeLabel })

  // add in the nodes
  var node = svg.append('g').selectAll('.node')
    .data(graph.nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')' })
    .call(d3.drag()
      .subject(function(d) { return d })
      .on('start', function() { this.parentNode.appendChild(this) })
      .on('drag', dragmove))

  // add the rectangles for the nodes
  node.append('rect')
    .attr('height', function(d) { return d.dy })
    .attr('width', sankey.nodeWidth())
    .style('fill', function(d) { return colorScale(d.color) })
    .style('stroke', 'white')
    .append('title')
    .text(function(d) { return d.label })

  // add in the title for the nodes
  node.append('text')
    .attr('x', -6)
    .attr('y', function(d) { return d.dy / 2 })
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .text(function(d) { return d.label })
    .style('font-size', props.moreSettings.fontSize)
    .filter(function(d) { return d.x < props.width / 2 })
    .attr('x', 6 + sankey.nodeWidth())
    .attr('text-anchor', 'start')

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this)
      .attr('transform', 
        'translate(' 
               + d.x + ',' 
               + (d.y = Math.max(
                 0, Math.min(props.height - d.dy, d3.event.y))
               ) + ')')
    sankey.relayout()
    link.attr('d', path)
  }
  
  function highlight(connection) {
    if (connection == null) d3.selectAll('.link').classed('active', false)
    else d3.selectAll('.link.' + connection).classed('active', true)
  }

}

class SankeyDiagram extends Component {

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
        <SVGPanZoom d3node={d3node} width={this.props.width} height={this.props.height} /> 
      </div>
    )
  }
}
export default SankeyDiagram
