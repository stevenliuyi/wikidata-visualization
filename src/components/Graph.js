import React, { Component } from 'react'
import * as d3 from 'd3'
import { getGraph } from '../utils/convertData'
import { getColorScale } from '../utils/scales'
import SVGPanZoom from './SVGPanZoom'

// force-directed graph d3 references:
// https://bl.ocks.org/mbostock/4062045
// https://bl.ocks.org/fancellu/2c782394602a93921faff74e594d1bb1
const updateD3Node = (props) => {

  var colorScale = getColorScale(props)
  var graph = getGraph(props)

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()
  svg = svg.append('g')
    .attr('width', props.width)
    .attr('height', props.height)

  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -2 5 5')
    .attr('refX', 8)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-2 L 5 ,0 L 0,2')
    .attr('fill', '#999')
    .attr('opacity', '0.7')
    .style('stroke','none')
  
  var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function(d) { return d.id }))
    .force('charge', d3.forceManyBody()
      .strength(props.moreSettings.strength).distanceMax(props.width/2))
    .force('center', d3.forceCenter(props.width / 2, props.height / 2))
  
  var link = svg.selectAll('.link')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('stroke-width', '1')
    .attr('stroke-opacity', '0.7')
    .attr('stroke', '#999')
    .attr('marker-end', 'url(#arrowhead)')

  var edgepaths = svg.selectAll('.edgepath')
    .data(graph.links)
    .enter()
    .append('path')
    .attr('class', 'edgepath')
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .attr('id', function (d, i) {return 'edgepath' + i})
    .style('pointer-events', 'none')

  var edgelabels = svg.selectAll('.edgelabel')
    .data(graph.links)
    .enter()
    .append('text')
    .style('pointer-events', 'none')
    .attr('class', 'edgelabel')
    .attr('id', function (d, i) {return 'edgelabel' + i})
    .attr('dy', -3)
    .attr('font-size', props.moreSettings.edgeFontSize)
    .attr('fill', '#999')
    .attr('opacity', '0.7')

  edgelabels.append('textPath')
    .attr('xlink:href', function (d, i) { return '#edgepath' + i })
    .style('text-anchor', 'middle')
    .style('pointer-events', 'none')
    .attr('startOffset', '50%')
    .text(function(d) { return d.edgeLabel })
  
  var node = svg.selectAll('.node')
    .data(graph.nodes)
    .enter().append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )
  
  node.append('circle')
    .attr('r', 4)
    .style('fill', function(d) { return colorScale(d.color) })

  node.append('title')
    .text(function(d) { return d.label })
  
  node.append('text')
    .attr('dy', -3)
    .attr('font-size', props.moreSettings.fontSize)
    .attr('opacity', 0.7)
    .text(function(d) { return d.label })

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked)
  
  simulation.force('link')
    .links(graph.links)
  
  function ticked() {
    link
      .attr('x1', function(d) { return d.source.x })
      .attr('y1', function(d) { return d.source.y })
      .attr('x2', function(d) { return d.target.x })
      .attr('y2', function(d) { return d.target.y })
  
    node
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'})


    if (props.header[props.settings['edge_label']]) {
      edgepaths
        .attr('d', function (d) {
          return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
        })

      //// don't flip the edge labels because the edges might be bidirectional
      //edgelabels
      //  .attr('transform', function (d) {
      //    if (d.target.x < d.source.x) {
      //      var bbox = this.getBBox()

      //      var rx = bbox.x + bbox.width / 2
      //      var ry = bbox.y + bbox.height / 2
      //      return 'rotate(180 ' + rx + ' ' + ry + ')'
      //    }
      //    else {
      //      return 'rotate(0)'
      //    }
      //  })
    }

  }
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }
  
  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
} 

class Graph extends Component {

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

export default Graph
