import React, { Component } from 'react'
import * as d3 from 'd3'
import rd3 from 'react-d3-library'
import { getTreeRoot } from '../utils/convertData'
import { getColorScale } from '../utils/scales'

const RD3Component = rd3.Component

// radial tree d3 reference: https://bl.ocks.org/mbostock/4063550
const getD3Node = (props) => {

  var colorScale = getColorScale(props)
  
  var d3node = document.createElement('div')

  var svg = d3.select(d3node)
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height)
    .append('g')
    .attr('transform', 'translate(' + (props.width/2) + ',' + (props.height/2) + ')')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '10')
  
  var radius = Math.min(props.width, props.height) / 2 * 0.8 

  var radialCluster = d3.cluster()
    .size([2*Math.PI, radius])
    .separation(function(a, b) {
      return (a.parent === b.parent ? 1 : 2) / a.depth
    })

  var radialTree = d3.tree()
    .size([2*Math.PI, radius])
    .separation(function(a, b) {
      return (a.parent === b.parent ? 1 : 2) / a.depth
    })
  
  var diagonal = d3.linkRadial()
    .angle(function(d) { return d.x })
    .radius(function(d) { return d.y })

  const radialPoint = (x, y) => {
    return [(y = +y) * Math.cos(x -= Math.PI /2), y * Math.sin(x)]
  }

  // convert data to d3 hierarchy format
  var root = getTreeRoot(props)
  if (root) {
    root = (props.treeType === 'cluster') ? radialCluster(root) : radialTree(root)
  } else { // null returned, error encountered while generating tree
    return d3node
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
    .attr('d', diagonal)

  // define node
  var node = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + radialPoint(d.x, d.y) + ')'
    })

  // add circles
  node.append('circle')
    .attr('r', 4)
    .style('fill', function(d) { return colorScale(d.data.color) })

  // add labels
  node.append('text')
    .attr('dy', '0.3em')
    .attr('x', function(d) { return (d.x < Math.PI) === (!d.children) ? 6 : -6 })
    .attr('text-anchor', function(d) { return (d.x < Math.PI) === (!d.children) ? 'start' : 'end' })
    .attr('transform', function(d) {
      return 'rotate(' + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI/2) * 180 / Math.PI + ')'
    })
    .text(function (d) { return d.data.label })

  return d3node
} 

class RadialTree extends Component {
  state = {
    d3: ''
  }

  componentWillMount() {
    this.setState({d3: getD3Node(this.props)})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({d3: getD3Node(nextProps)})
  }

  render() {
    return (
      <div><RD3Component data={this.state.d3} /></div>
    )
  }
}

export default RadialTree
