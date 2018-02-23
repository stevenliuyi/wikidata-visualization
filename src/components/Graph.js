import React, { Component } from 'react'
import * as d3 from 'd3'
import { getGraph } from '../utils/convertData'
import { getColorScale } from '../utils/scales'
import SVGPanZoom from './SVGPanZoom'
import chroma from 'chroma-js'
import Info from './Info'
import { drawTooltip, updateTooltip } from '../utils/draw'

// force-directed graph d3 references:
// https://bl.ocks.org/mbostock/4062045
// https://bl.ocks.org/fancellu/2c782394602a93921faff74e594d1bb1
const updateD3Node = props => {
  var graph = getGraph(props)
  var colorScale = getColorScale(props, graph.nodes)

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

  if (props.moreSettings.showArrows)
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -2 5 5')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-2 L 5 ,0 L 0,2')
      .attr('fill', '#999')
      .attr('opacity', '0.7')
      .style('stroke', 'none')

  var simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3.forceLink().id(function(d) {
        return d.id
      })
    )
    .force(
      'charge',
      d3
        .forceManyBody()
        .strength(props.moreSettings.strength)
        .distanceMax(props.width / 2)
    )
    .force('center', d3.forceCenter(props.width / 2, props.height / 2))

  var link = svg
    .selectAll('.link')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('id', function(d, i) {
      return 'link' + i
    })
    .attr('class', 'link')
    .attr('stroke-width', '1.5')
    .attr('stroke-opacity', '0.7')
    .attr('stroke', '#999')
    .attr('marker-end', 'url(#arrowhead)')

  // for tooltips
  var link2 = svg
    .selectAll('.link2')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('class', 'link2')
    .attr('stroke-width', '8')
    .attr('stroke-opacity', '0')
    .attr('stroke', '#999')
    .on('mouseover', function(d, i) {
      d3.select('#link' + i).attr('stroke', '#337ab7')
      d3.select('#link' + i).attr('stroke-width', '3')
      d3.select('#link' + i).attr('marker-end', 'none')
      d3.select('#edgelabel' + i).attr('font-weight', 'bold')

      d3
        .select('#circle' + d.source.index)
        .attr('fill', chroma(colorScale(d.source.color)).brighten(0.6))
      d3.select('#text' + d.source.index).attr('font-weight', 'bold')

      d3
        .select('#circle' + d.target.index)
        .attr('fill', chroma(colorScale(d.target.color)).brighten(0.6))
      d3.select('#text' + d.target.index).attr('font-weight', 'bold')
      drawTooltip(d.tooltipHTML)
    })
    .on('mousemove', function(d) {
      updateTooltip()
    })
    .on('mouseout', function(d, i) {
      tooltip.style('display', 'none')
      d3.select('#link' + i).attr('stroke', '#999')
      d3.select('#link' + i).attr('stroke-width', '1.5')
      d3.select('#link' + i).attr('marker-end', 'url(#arrowhead)')
      d3.select('#edgelabel' + i).attr('font-weight', 'normal')

      d3
        .select('#circle' + d.source.index)
        .attr('fill', colorScale(d.source.color))
      d3.select('#text' + d.source.index).attr('font-weight', 'normal')

      d3
        .select('#circle' + d.target.index)
        .attr('fill', colorScale(d.target.color))
      d3.select('#text' + d.target.index).attr('font-weight', 'normal')
    })

  var edgepaths = svg
    .selectAll('.edgepath')
    .data(graph.links)
    .enter()
    .append('path')
    .attr('class', 'edgepath')
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .attr('id', function(d, i) {
      return 'edgepath' + i
    })
    .style('pointer-events', 'none')

  var edgelabels = svg
    .selectAll('.edgelabel')
    .data(graph.links)
    .enter()
    .append('text')
    .attr('id', function(d, i) {
      return 'edgelabel' + i
    })
    .style('pointer-events', 'none')
    .attr('class', 'edgelabel')
    .attr('id', function(d, i) {
      return 'edgelabel' + i
    })
    .attr('dy', -3)
    .attr('font-size', props.moreSettings.edgeFontSize)
    .attr('fill', '#999')
    .attr('opacity', '0.7')

  edgelabels
    .append('textPath')
    .attr('xlink:href', function(d, i) {
      return '#edgepath' + i
    })
    .style('text-anchor', 'middle')
    .style('pointer-events', 'none')
    .attr('startOffset', '50%')
    .text(function(d) {
      return d.edgeLabel
    })

  var node = svg
    .selectAll('.node')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    )
    .on('mouseover', function(d, i) {
      d3
        .select('#circle' + i)
        .attr('fill', chroma(colorScale(d.color)).brighten(0.6))
      d3.select('#text' + i).attr('font-weight', 'bold')
    })
    .on('mouseout', function(d, i) {
      d3.select('#circle' + i).attr('fill', colorScale(d.color))
      d3.select('#text' + i).attr('font-weight', 'normal')
    })

  node
    .append('circle')
    .attr('id', function(d, i) {
      return 'circle' + i
    })
    .attr('r', 4)
    .attr('fill', function(d) {
      return colorScale(d.color)
    })

  //node.append('title')
  //  .text(function(d) { return d.label })

  node
    .append('text')
    .attr('id', function(d, i) {
      return 'text' + i
    })
    .attr('dy', -3)
    .attr('font-size', props.moreSettings.fontSize)
    .attr('opacity', 0.7)
    .text(function(d) {
      return d.label
    })

  simulation.nodes(graph.nodes).on('tick', ticked)

  simulation.force('link').links(graph.links)

  function ticked() {
    link
      .attr('x1', function(d) {
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      })

    link2
      .attr('x1', function(d) {
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      })

    node.attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

    if (props.header[props.settings['edge_label']]) {
      edgepaths.attr('d', function(d) {
        return (
          'M ' +
          d.source.x +
          ' ' +
          d.source.y +
          ' L ' +
          d.target.x +
          ' ' +
          d.target.y
        )
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
    this.setState({ mounted: true })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.mounted) updateD3Node(nextProps)
  }

  render() {
    if (!this.props.dataTypes.includes('item'))
      return <Info info="no-item" text="force-directed graph" />

    return (
      <div id="chart">
        <SVGPanZoom {...this.props}>
          <svg width={this.props.width} height={this.props.height} />
        </SVGPanZoom>
      </div>
    )
  }
}

export default Graph
