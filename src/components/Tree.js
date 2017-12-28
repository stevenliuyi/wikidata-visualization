import React, { Component } from 'react'
import * as d3 from 'd3'
import rd3 from 'react-d3-library'
import { getTreeRoot } from '../utils/convertData'
import { getColorScale } from '../utils/scales'

const RD3Component = rd3.Component

// tree d3 reference: https://bl.ocks.org/mbostock/4339184
const getD3Node = (props) => {

  var colorScale = getColorScale(props)
  
  var d3node = document.createElement('div')

  var svg = d3.select(d3node)
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height)
    .append('g')
    .attr('transform', 'translate(40,0)')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '10')
  
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

  // add labels
  node.append('text')
    .attr('dy', '0.3em')
    .attr('x', function(d) { return d.children ? -8 : -8 })
    .attr('text-anchor', function(d) { return d.children ? 'end' : 'start' })
    .text(function (d) { return d.data.label })

  return d3node
} 

class Tree extends Component {
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

export default Tree
