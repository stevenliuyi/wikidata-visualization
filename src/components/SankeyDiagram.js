import React, { Component } from 'react'
import * as d3 from 'd3'
import { getGraph } from '../utils/convertData'
import { getColorScale } from '../utils/scales'
import SVGPanZoom from './SVGPanZoom'
import { d3Sankey } from '../utils/sankey'
import toposort from 'toposort'
import chroma from 'chroma-js'
import Info from './Info'
import { drawTooltip, updateTooltip } from '../utils/draw'

// Sankey diagram d3 reference: https://bl.ocks.org/ebendennis/07c361ea822d99872adffea9c7ccf19b
const updateD3Node = props => {
  var graph = getGraph(props, true)

  // remove self-pointing links
  graph.links = graph.links.filter(link => link.source !== link.target)

  // perform topological sorting to determine if the graph is a DAG
  try {
    toposort(graph.links.map(link => [link.source, link.target]))
  } catch (error) {
    // the graph is not acyclic, cannot generate Sankey diagram
    return 'sankey-error'
  }

  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3ToolTip')

  var colorScale = getColorScale(props, graph.nodes)

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()

  svg = svg
    .append('g')
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

  // check if all heights are positive
  if (!graph.nodes.map(n => n.dy).every(h => h >= 0)) return 'negative-height'

  // add in the links
  var link = svg
    .append('g')
    .selectAll('.link')
    .data(graph.links)
    .enter()
    .append('path')
    .attr('class', function(d) {
      return 'link str' + d.index
    })
    .attr('d', path)
    .style('fill-opacity', 0)
    .style('stroke', function(d) {
      return '#ccc'
    })
    .style('stroke-width', function(d) {
      return Math.max(1, d.dy)
    })
    .style('stroke-opacity', 0.5)
    .sort(function(a, b) {
      return b.dy - a.dy
    })
    .on('mouseover', function(d) {
      const color = d3.select('.str' + d.index).style('stroke')
      d3.select('.str' + d.index).style('stroke', chroma(color).brighten(0.6))

      d3
        .select('#rect' + d.source.index)
        .attr('fill', chroma(colorScale(d.source.color)).brighten(0.6))
      d3.select('#text' + d.source.index).attr('font-weight', 'bold')

      d3
        .select('#rect' + d.target.index)
        .attr('fill', chroma(colorScale(d.target.color)).brighten(0.6))
      d3.select('#text' + d.target.index).attr('font-weight', 'bold')
      drawTooltip(d.tooltipHTML)
    })
    .on('mousemove', function() {
      updateTooltip()
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none')

      const color = d3.select('.str' + d.index).style('stroke')
      d3.select('.str' + d.index).style('stroke', chroma(color).darken(0.6))

      d3
        .select('#rect' + d.source.index)
        .attr('fill', colorScale(d.source.color))
      d3.select('#text' + d.source.index).attr('font-weight', 'normal')

      d3
        .select('#rect' + d.target.index)
        .attr('fill', colorScale(d.target.color))
      d3.select('#text' + d.target.index).attr('font-weight', 'normal')
    })

  // add the link titles
  link.append('title').text(function(d) {
    return d.edgeLabel
  })

  // add in the nodes
  var node = svg
    .append('g')
    .selectAll('.node')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    .call(
      d3
        .drag()
        .subject(function(d) {
          return d
        })
        .on('start', function() {
          this.parentNode.appendChild(this)
        })
        .on('drag', dragmove)
    )
    .on('mouseover', function(d, i) {
      d3
        .select('#rect' + i)
        .attr('fill', chroma(colorScale(d.color)).brighten(0.6))
      d3.select('#text' + i).attr('font-weight', 'bold')
    })
    .on('mouseout', function(d, i) {
      d3.select('#rect' + i).attr('fill', colorScale(d.color))
      d3.select('#text' + i).attr('font-weight', 'normal')
    })

  // add the rectangles for the nodes
  node
    .append('rect')
    .attr('id', function(d, i) {
      return 'rect' + i
    })
    .attr('height', function(d) {
      return d.dy
    })
    .attr('width', sankey.nodeWidth())
    .attr('fill', function(d) {
      return colorScale(d.color)
    })
    .style('stroke', 'white')
    .append('title')
    .text(function(d) {
      return d.label
    })

  // add in the title for the nodes
  node
    .append('text')
    .attr('id', function(d, i) {
      return 'text' + i
    })
    .attr('x', -6)
    .attr('y', function(d) {
      return d.dy / 2
    })
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .text(function(d) {
      return d.label
    })
    .style('font-size', props.moreSettings.fontSize)
    .filter(function(d) {
      return d.x < props.width / 2
    })
    .attr('x', 6 + sankey.nodeWidth())
    .attr('text-anchor', 'start')

  // the function for moving the nodes
  function dragmove(d) {
    d3
      .select(this)
      .attr(
        'transform',
        'translate(' +
          d.x +
          ',' +
          (d.y = Math.max(0, Math.min(props.height - d.dy, d3.event.y))) +
          ')'
      )
    sankey.relayout()
    link.attr('d', path)
  }

  //function highlight(connection) {
  //  if (connection == null) d3.selectAll('.link').classed('active', false)
  //  else d3.selectAll('.link.' + connection).classed('active', true)
  //}

  return 'ok'
}

class SankeyDiagram extends Component {
  state = {
    mounted: false,
    error: 'ok'
  }

  componentDidMount() {
    updateD3Node(this.props)
    this.setState({ mounted: true })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.mounted) {
      const err = updateD3Node(nextProps)
      if (this.state.error !== err) this.setState({ error: err })
    }
  }

  render() {
    if (!this.props.dataTypes.includes('item'))
      return <Info info="no-item" text="sankey diagram" />
    if (this.props.settings['link-from'] === this.props.settings['link-to'])
      return <Info info="self-pointing" showSettings={true} />

    return (
      <div id="chart">
        {this.state.error === 'sankey-error' && (
          <Info info="sankey-error" showSettings={true} />
        )}
        {this.state.error === 'negative-height' && (
          <Info info="negative-height" showSettings={true} />
        )}
        {this.state.error === 'ok' && (
          <SVGPanZoom {...this.props}>
            <svg width={this.props.width} height={this.props.height} />
          </SVGPanZoom>
        )}
      </div>
    )
  }
}
export default SankeyDiagram
