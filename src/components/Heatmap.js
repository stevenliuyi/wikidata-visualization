import React, { Component } from 'react'
import * as d3 from 'd3'
import { getMatrix2 } from '../utils/convertData'
import SVGPanZoom from './SVGPanZoom'
import chroma from 'chroma-js'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import Info from './Info'

// heat matrix d3 references:
// https://moleleo.github.io/D3V4NetworkDataVisualizations/
// https://bost.ocks.org/mike/miserables/
const updateD3Node = props => {
  d3.selectAll('.d3ToolTip').remove()
  var tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3ToolTip')

  var [matrix, row_labels, col_labels, colorScale] = getMatrix2(props)
  var transpose = array => array[0].map((col, i) => array.map(row => row[i]))

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()
  svg = svg
    .append('g')
    .attr('width', props.width)
    .attr('height', props.height)

  var margin = 40
  svg = svg
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + margin + ')')

  var width = Math.min(props.width, props.height)
  var x = d3.scaleBand().rangeRound([0, width - margin])
  x.domain([
    ...(row_labels.length >= col_labels.length ? row_labels : col_labels).keys()
  ])

  var row = svg
    .selectAll('.row')
    .data(matrix)
    .enter()
    .append('g')
    .attr('class', 'row')
    .attr('transform', function(d, i) {
      return 'translate(0,' + x(i) + ')'
    })
    .each(getRow)

  row.append('line').attr('x2', width)

  row
    .append('text')
    .attr('x', -6)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '.32em')
    .attr('text-anchor', 'end')
    .text(function(d, i) {
      return row_labels[i]
    })
    .style('font-size', props.moreSettings.fontSize)

  var column = svg
    .selectAll('.column')
    .data(transpose(matrix))
    .enter()
    .append('g')
    .attr('class', 'column')
    .attr('transform', function(d, i) {
      return 'translate(' + x(i) + ')rotate(-90)'
    })

  column.append('line').attr('x1', -width)

  column
    .append('text')
    .attr('x', 6)
    .attr('y', x.bandwidth() / 2)
    .attr('dy', '.32em')
    .attr('text-anchor', 'start')
    .text(function(d, i) {
      return col_labels[i]
    })
    .style('font-size', props.moreSettings.fontSize)

  function getRow(row) {
    d3
      .select(this)
      .selectAll('.cellAM')
      .data(row)
      .enter()
      .append('rect')
      .attr('id', function(d, i) {
        return 'rect' + i
      })
      .attr('class', 'cellAM')
      .attr('x', function(d, i) {
        return x(i)
      })
      .attr('width', x.bandwidth())
      .attr('height', x.bandwidth())
      .attr('fill', function(d, i) {
        return d.color
      })
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', function(d) {
        updateTooltip()
      })
  }

  function mouseover(p, j) {
    d3
      .selectAll('.row text')
      .filter(function(d, i) {
        return i === p.row
      })
      .style('font-weight', 'bold')
      .style('fill', '#337ab7')

    d3
      .selectAll('.column text')
      .filter(function(d, i) {
        return i === j
      })
      .style('font-weight', 'bold')
      .style('fill', '#337ab7')

    d3
      .selectAll('#rect' + j)
      .filter(function(d, i) {
        return i === p.row
      })
      .attr('fill', chroma(p.color).brighten(0.6))

    drawTooltip(p.tooltipHTML)
  }

  function mouseout(p, j) {
    d3
      .selectAll('text')
      .style('font-weight', 'normal')
      .style('fill', 'black')

    d3
      .selectAll('#rect' + j)
      .filter(function(d, i) {
        return i === p.row
      })
      .attr('fill', p.color)

    tooltip.style('display', 'none')
  }

  drawLegend(svg, colorScale, props)
}

class Heatmap extends Component {
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
      return <Info info="no-item" text="heat map" />

    return (
      <div id="chart">
        <SVGPanZoom {...this.props}>
          <svg width={this.props.width} height={this.props.height} />
        </SVGPanZoom>
      </div>
    )
  }
}

export default Heatmap
