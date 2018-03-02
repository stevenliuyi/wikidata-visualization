import React, { Component } from 'react'
import * as d3 from 'd3'
import { getTreeRoot } from '../utils/convertData'
import { getColorScale } from '../utils/scales'
import SVGPanZoom from './SVGPanZoom'
import chroma from 'chroma-js'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import Info from './Info'

// tree d3 reference: https://bl.ocks.org/mbostock/4339184
const updateD3Node = props => {
  var colorScale = getColorScale(props)

  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3ToolTip')

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()
  var g = svg
    .append('g')
    .attr('width', props.width)
    .attr('height', props.height)
    .append('g')
    .attr('transform', 'translate(40,0)')
    .attr('font-size', props.moreSettings.fontSize)

  var cluster = d3.cluster().size([props.height, props.width - 160])

  var tree = d3.tree().size([props.height, props.width - 160])

  var linkHorizontal = d3
    .linkHorizontal()
    .x(function(d) {
      return d.y
    })
    .y(function(d) {
      return d.x
    })

  // convert data to d3 hierarchy format
  var root = getTreeRoot(props)
  if (root) {
    root = props.treeType === 'cluster' ? cluster(root) : tree(root)
  } else {
    // null returned, error encountered while generating tree
    return null
  }

  // define link between nodes
  g
    .selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('id', function(d, i) {
      return 'link' + i
    })
    .attr('class', 'link')
    .style('fill', 'none')
    .style('stroke', '#999')
    .style('stroke-opacity', '0.7')
    .style('stroke-width', '1.5')
    .attr('d', linkHorizontal)

  // for tooltips
  g
    .selectAll('.link2')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link2')
    .style('fill', 'none')
    .style('stroke', '#999')
    .style('stroke-opacity', '0')
    .style('stroke-width', '8')
    .attr('d', linkHorizontal)
    .on('mouseover', function(d, i) {
      d3.select('#link' + i).style('stroke', '#337ab7')
      d3.select('#link' + i).style('stroke-width', '3')

      d3
        .select('#circle' + d.source.data.index)
        .attr('fill', chroma(colorScale(d.source.data.color)).brighten(0.6))
      d3.select('#text' + d.source.data.index).attr('font-weight', 'bold')

      d3
        .select('#circle' + d.target.data.index)
        .attr('fill', chroma(colorScale(d.target.data.color)).brighten(0.6))
      d3.select('#text' + d.target.data.index).attr('font-weight', 'bold')
      drawTooltip(d.target.data.tooltipHTML)
    })
    .on('mousemove', function() {
      updateTooltip()
    })
    .on('mouseout', function(d, i) {
      tooltip.style('display', 'none')

      d3.select('#link' + i).style('stroke', '#999')
      d3.select('#link' + i).style('stroke-width', '1.5')

      d3
        .select('#circle' + d.source.data.index)
        .attr('fill', colorScale(d.source.data.color))
      d3.select('#text' + d.source.data.index).attr('font-weight', 'normal')

      d3
        .select('#circle' + d.target.data.index)
        .attr('fill', colorScale(d.target.data.color))
      d3.select('#text' + d.target.data.index).attr('font-weight', 'normal')
    })

  // define node
  var node = g
    .selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + d.y + ',' + d.x + ')'
    })
    .on('mouseover', function(d) {
      d3
        .select('#circle' + d.data.index)
        .attr('fill', chroma(colorScale(d.data.color)).brighten(0.6))
      d3.select('#text' + d.data.index).attr('font-weight', 'bold')
    })
    .on('mouseout', function(d) {
      d3.select('#circle' + d.data.index).attr('fill', colorScale(d.data.color))
      d3.select('#text' + d.data.index).attr('font-weight', 'normal')
    })

  // add circles
  node
    .append('circle')
    .attr('id', function(d) {
      return 'circle' + d.data.index
    })
    .attr('r', 4)
    .attr('fill', function(d) {
      return colorScale(d.data.color)
    })

  // add labels
  node
    .append('text')
    .attr('id', function(d) {
      return 'text' + d.data.index
    })
    .attr('dy', '0.3em')
    .attr('x', function(d) {
      return d.children ? -8 : -8
    })
    .attr('text-anchor', function(d) {
      return d.children ? 'end' : 'start'
    })
    .text(function(d) {
      return d.data.label
    })

  drawLegend(svg, colorScale, props)
}

class Tree extends Component {
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
      return <Info info="no-item" text={this.props.treeType} />

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

export default Tree
