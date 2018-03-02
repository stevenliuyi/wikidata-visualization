import React, { Component } from 'react'
import * as d3 from 'd3'
import { getTreeRoot } from '../utils/convertData'
import { getColorScale } from '../utils/scales'
import SVGPanZoom from './SVGPanZoom'
import chroma from 'chroma-js'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import Info from './Info'

// zoomable circle packing d3 reference: https://bl.ocks.org/mbostock/7607535
const updateD3Node = props => {
  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3ToolTip')

  var colorScale = getColorScale(props)
  var setColor = props.header[props.settings['color']] == null ? false : true

  var diameter = Math.min(props.width, props.height)
  var margin = 20

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()
  var g = svg
    .append('g')
    .attr('width', props.width)
    .attr('height', props.height)
    .append('g')
    .attr(
      'transform',
      'translate(' + props.width / 2 + ',' + props.height / 2 + ')'
    )
    .attr('font-size', props.moreSettings.fontSize)

  // convert data to d3 hierarchy format
  var root = getTreeRoot(props)
  if (!root) return // error encountered when generating tree

  var colorDepth = d3
    .scaleLinear()
    .domain([0, root.height])
    .range(['#eee', '#999'])

  root = root
    .sum(function(d) {
      return d.radius
    })
    .sort(function(a, b) {
      return b.value - a.value
    })

  var pack = d3
    .pack()
    .size([props.width - margin, props.height - margin])
    .padding(5)

  var focus = root,
    nodes = pack(root).descendants(),
    view

  var dragged
  var circle = g
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('id', function(d, i) {
      return 'circle' + i
    })
    .style('fill', function(d) {
      return setColor ? colorScale(d.data.color) : colorDepth(d.depth)
    })
    .style('stroke-width', function(d) {
      return setColor ? 1 : 0
    })
    .style('stroke', function(d) {
      return setColor ? chroma(colorScale(d.data.color)).brighten(1) : '#fff'
    })
    .style('cursor', 'pointer')
    .style('pointer-events', function(d) {
      return d.children ? 'auto' : 'none'
    })
    .on('click', function(d) {
      d3.event.stopPropagation()
      if (dragged) return
      if (focus !== d) zoom(d)
    })
    .on('mousedown', function() {
      dragged = false
    })
    .on('mouseup', function() {
      const { startX, startY, endX, endY } = props.viewer.getValue()
      if (startX !== endX || startY !== endY) dragged = true
    })
    .on('touchstart', function() {
      dragged = false
    })
    .on('touchmove', function(d) {
      dragged = true
    })
    .on('touchend', function(d) {
      if (dragged) return
      if (focus !== d) zoom(d)
    })

  g
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('id', function(d, i) {
      return 'text' + i
    })
    .style('text-anchor', 'middle')
    .style(
      'text-shadow',
      '0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff'
    )
    .style('cursor', 'pointer')
    .style('pointer-events', function(d) {
      return d.children ? 'auto' : 'none'
    })
    .style('fill-opacity', function(d) {
      return d.parent === root ? 1 : 0
    })
    .style('display', function(d) {
      return d.parent === root ? 'inline' : 'none'
    })
    .text(function(d) {
      return d.data.label
    })

  var node = g
    .selectAll('circle,text')
    .on('mouseover', function(d, i) {
      d3
        .select('#circle' + i)
        .style('fill', function(d) {
          const originalColor = setColor
            ? colorScale(d.data.color)
            : colorDepth(d.depth)
          return chroma(originalColor).brighten(0.6)
        })
        .style('stroke-width', '1')
        .style('stroke', '#999')
      drawTooltip(d.data.tooltipHTML)
    })
    .on('mousemove', function() {
      updateTooltip()
    })
    .on('mouseout', function(d, i) {
      d3
        .select('#circle' + i)
        .style('fill', function(d) {
          return setColor ? colorScale(d.data.color) : colorDepth(d.depth)
        })
        .style('stroke-width', function(d) {
          return setColor ? 1 : 0
        })
        .style('stroke', function(d) {
          return setColor
            ? chroma(colorScale(d.data.color)).brighten(1)
            : '#fff'
        })
      tooltip.style('display', 'none')
    })

  g.on('click', function() {
    zoom(root)
  })
  zoomTo([root.x, root.y, root.r * 2 + margin])

  drawLegend(svg, colorScale, props)

  function zoom(d) {
    props.viewer.reset()
    focus = d
    var transition = d3
      .transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween('zoom', function(d) {
        var i = d3.interpolateZoom(view, [
          focus.x,
          focus.y,
          focus.r * 2 + margin
        ])
        return function(t) {
          zoomTo(i(t))
        }
      })

    transition
      .selectAll('text')
      .filter(function(d) {
        return d.parent === focus || this.style.display === 'inline'
      })
      .style('fill-opacity', function(d) {
        return d.parent === focus ? 1 : 0
      })
      .on('start', function(d) {
        if (d.parent === focus) this.style.display = 'inline'
      })
      .on('end', function(d) {
        if (d.parent !== focus) this.style.display = 'none'
      })
  }

  function zoomTo(v) {
    var k = diameter / v[2]
    view = v
    node.attr('transform', function(d) {
      return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')'
    })
    circle.attr('r', function(d) {
      return d.r * k
    })
  }
}

class CirclePacking extends Component {
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
      return <Info info="no-item" text="circle packing" />

    const root = getTreeRoot(this.props)
    if (root == null) return <Info info="tree-error" showSettings={true} />
    else if (root.height === 0)
      return <Info info="single-node" showSettings={true} />

    return (
      <div id="chart">
        <SVGPanZoom {...this.props}>
          <svg width={this.props.width} height={this.props.height} />
        </SVGPanZoom>
      </div>
    )
  }
}

export default CirclePacking
