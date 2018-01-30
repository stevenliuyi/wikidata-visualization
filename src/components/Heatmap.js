import React, { Component } from 'react'
import * as d3 from 'd3'
import { getMatrix2 } from '../utils/convertData'
import ReactFauxDOM from 'react-faux-dom'
import SVGPanZoom from './SVGPanZoom'
import chroma from 'chroma-js'

// heat matrix d3 references:
// https://moleleo.github.io/D3V4NetworkDataVisualizations/
// https://bost.ocks.org/mike/miserables/
const getD3Node = (props) => {

  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3.select('body').append('div').attr('class', 'd3ToolTip')

  var d3node = new ReactFauxDOM.Element('svg')
  
  var [matrix, row_labels, col_labels] = getMatrix2(props)
  var transpose = array => array[0].map((col,i) => array.map(row => row[i]))

  var svg = d3.select(d3node)
    .attr('width', props.width)
    .attr('height', props.height)

  var margin = 40
  svg = svg.append('g').attr('transform','translate(' + margin + ',' + margin + ')')

  var width = Math.min(props.width, props.height)
  var x = d3.scaleBand().rangeRound([0, width-margin])
  x.domain([...((row_labels.length >= col_labels.length) ? row_labels : col_labels).keys()])

  var row = svg.selectAll('.row')
    .data(matrix)
    .enter().append('g')
    .attr('class', 'row')
    .attr('transform', function(d, i) { return 'translate(0,' + x(i) + ')' })
    .each(getRow)

  row.append('line')
    .attr('x2', width)

  row.append('text')
    .attr('x', -6)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '.32em')
    .attr('text-anchor', 'end')
    .text(function(d, i) { return row_labels[i] })
    .style('font-size', props.moreSettings.fontSize)

  var column = svg.selectAll('.column')
    .data(transpose(matrix))
    .enter().append('g')
    .attr('class', 'column')
    .attr('transform', function(d, i) { return 'translate(' + x(i) + ')rotate(-90)' })

  column.append('line')
    .attr('x1', -width)

  column.append('text')
    .attr('x', 6)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '.32em')
    .attr('text-anchor', 'start')
    .text(function(d, i) { return col_labels[i] })
    .style('font-size', props.moreSettings.fontSize)


  function getRow(row) {
    d3.select(this).selectAll('.cellAM')
      .data(row)
      .enter().append('rect')
      .attr('id', function(d,i) { return 'rect'+i })
      .attr('class', 'cellAM')
      .attr('x', function(d,i) { return x(i) })
      .attr('width', x.bandwidth())
      .attr('height', x.bandwidth())
      .attr('fill', function(d,i) { return d.color })
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', function(d) {
        tooltip
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY + 10 + 'px')
          .style('display', 'inline-block')
          .html(d.tooltipHTML)
      })
  
  }

  function mouseover(p,j) {
    d3.selectAll('.row text')
      .filter(function(d,i) { return i === p.row })
      .style('font-weight','bold')
      .style('fill', '#337ab7')

    d3.selectAll('.column text')
      .filter(function(d,i) {return i === j })
      .style('font-weight','bold')
      .style('fill', '#337ab7')

    d3.selectAll('#rect'+j)
      .filter(function(d,i) { return i === p.row })
      .attr('fill', chroma(p.color).brighten(0.6))
  }

  function mouseout(p,j) {
    d3.selectAll('text')
      .style('font-weight','normal')
      .style('fill', 'black')

    d3.selectAll('#rect'+j)
      .filter(function(d,i) { return i === p.row })
      .attr('fill', p.color)

    tooltip.style('display', 'none')
  }
  
  return d3node.toReact()

} 

class Heatmap extends Component {

  render() {
    const d3node = getD3Node(this.props)
    return (
      <SVGPanZoom d3node={d3node} width={this.props.width} height={this.props.height} /> 
    )
  }
}

export default Heatmap
