import React, { Component } from 'react'
import { getGroupValues } from '../utils/convertData'
import * as d3 from 'd3'
import SVGPanZoom from './SVGPanZoom'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import chroma from 'chroma-js'
import Info from './Info'
import { getFormat } from '../utils/format'

// bar chart d3 references
// http://bl.ocks.org/mbostock/3943967
const updateD3Node = (props, transition) => {
  // bar type
  if (
    d3
      .select('#bartype-select')
      .select('select')
      .empty()
  )
    return
  const value = d3
    .select('#bartype-select')
    .select('select')
    .property('value')

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

  // The xz array has m elements, representing the x-values shared by all series.
  // The yz array has n elements, representing the y-values of each of the n series.
  // Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
  // The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.
  var [xz, yz, colors, colorScale, tooltipHTMLs] = getGroupValues(props)
  // calculate percentages for 100% stacked bar chart
  const ysum = yz.reduce((acc, cur) => acc.map((num, i) => num + cur[i]))
  if (value === '100% stacked')
    yz = yz.map(yarray => yarray.map((num, i) => num / ysum[i]))

  var n = yz.length,
    y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
    yMax = d3.max(yz, function(y) {
      return d3.max(y)
    }),
    y1Max = d3.max(y01z, function(y) {
      return d3.max(y, function(d) {
        return d[1]
      })
    })

  var margin = { top: 40, right: 40, bottom: 40, left: 60 },
    width = props.width - margin.left - margin.right,
    height = props.height - margin.top - margin.bottom

  svg = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var x = d3
    .scaleBand()
    .domain(xz)
    .rangeRound([0, width])
    .padding(0.08)

  var y = d3
    .scaleLinear()
    .domain([0, y1Max])
    .range([height, 0])

  // grid lines
  var gridlines = null
  if (props.axisSettings.ygridlines) {
    const yFormat = getFormat(
      props.axisSettings.yformat,
      props.axisSettings.yprecision
    )
    gridlines = svg
      .append('g')
      .attr('class', 'gridline')
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .ticks(props.axisSettings.yticks)
          .tickFormat(yFormat)
      )
  }

  var series = svg
    .selectAll('.series')
    .data(y01z)
    .enter()
    .append('g')
    .attr('id', function(d, i) {
      return 'series' + i
    })
    .attr('fill', function(d, i) {
      return colors[i]
    })

  var rect = series
    .selectAll('rect')
    .data(function(d) {
      return d
    })
    .enter()
    .append('rect')
    .attr('class', function(d, i) {
      return 'rect' + i
    })
    .attr('x', function(d, i) {
      return x(xz[i])
    })
    .attr('y', height)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on('mouseover', function(d, i) {
      d3.range(n).forEach(group_idx => {
        d3
          .select('#series' + group_idx + '>.rect' + i)
          .attr('fill', function(d, i) {
            return chroma(colors[group_idx]).brighten(0.6)
          })
      })
      d3.select('#text' + i).attr('font-weight', 'bold')
      drawTooltip(tooltipHTMLs[i])
    })
    .on('mousemove', function() {
      updateTooltip()
    })
    .on('mouseout', function(d, i) {
      tooltip.style('display', 'none')
      d3.range(n).forEach(group_idx => {
        d3
          .select('#series' + group_idx + '>.rect' + i)
          .attr('fill', function(d, i) {
            return colors[group_idx]
          })
      })
      d3.select('#text' + i).attr('font-weight', 'normal')
    })

  if (document.getElementById('bartype-select') == null) return
  if (transition) {
    if (value === 'grouped') transitionGrouped()
    else transitionStacked()
  } else {
    if (value === 'grouped') noTransitionGrouped()
    else noTransitionStacked()
  }

  svg
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(
      d3
        .axisBottom(x)
        .tickSize(0)
        .tickPadding(6)
    )
    .selectAll('text')
    .attr('id', function(d, i) {
      return 'text' + i
    })
    .style('font-size', props.moreSettings.fontSize)
    .style('text-anchor', 'end')
    .style('alignment-baseline', 'central')
    .attr('dx', '-.8em')
    .attr('dy', '-.3em')
    .attr('transform', 'rotate(-90)')

  // update styles for axis and gridlines
  d3
    .selectAll('.gridline line')
    .style('stroke', '#ddd')
    .style('stroke-opacity', 0.7)
    .style('shape-rendering', 'crispEdges')

  d3.selectAll('.gridline path').style('stroke-width', 0)

  d3.selectAll('.axis path').style('display', 'none')

  drawLegend(svg, colorScale, props)

  function transitionGrouped() {
    y.domain([0, yMax])

    rect
      .transition()
      .duration(500)
      .delay(function(d, i) {
        return i * 10
      })
      .attr('x', function(d, i) {
        return x(xz[i]) + x.bandwidth() / n * this.parentNode.__data__.key
      })
      .attr('width', x.bandwidth() / n)
      .transition()
      .attr('y', function(d) {
        return y(d[1] - d[0])
      })
      .attr('height', function(d) {
        return y(0) - y(d[1] - d[0])
      })

    if (props.axisSettings.ygridlines) {
      const yFormat = getFormat(
        props.axisSettings.yformat,
        props.axisSettings.yprecision
      )
      gridlines.transition().call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .ticks(props.axisSettings.yticks)
          .tickFormat(yFormat)
      )
    }
  }

  function noTransitionGrouped() {
    y.domain([0, yMax])

    rect
      .attr('x', function(d, i) {
        return x(xz[i]) + x.bandwidth() / n * this.parentNode.__data__.key
      })
      .attr('width', x.bandwidth() / n)
      .attr('y', function(d) {
        return y(d[1] - d[0])
      })
      .attr('height', function(d) {
        return y(0) - y(d[1] - d[0])
      })

    if (props.axisSettings.ygridlines) {
      const yFormat = getFormat(
        props.axisSettings.yformat,
        props.axisSettings.yprecision
      )
      gridlines.call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .ticks(props.axisSettings.yticks)
          .tickFormat(yFormat)
      )
    }
  }

  function transitionStacked() {
    y.domain([0, y1Max])

    rect
      .transition()
      .duration(500)
      .delay(function(d, i) {
        return i * 10
      })
      .attr('y', function(d) {
        return y(d[1])
      })
      .attr('height', function(d) {
        return y(d[0]) - y(d[1])
      })
      .transition()
      .attr('x', function(d, i) {
        return x(xz[i])
      })
      .attr('width', x.bandwidth())

    if (props.axisSettings.ygridlines) {
      const yFormat = getFormat(
        props.axisSettings.yformat,
        props.axisSettings.yprecision
      )
      gridlines.transition().call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .ticks(props.axisSettings.yticks)
          .tickFormat(yFormat)
      )
    }
  }

  function noTransitionStacked() {
    y.domain([0, y1Max])

    rect
      .attr('y', function(d) {
        return y(d[1])
      })
      .attr('height', function(d) {
        return y(d[0]) - y(d[1])
      })
      .attr('x', function(d, i) {
        return x(xz[i])
      })
      .attr('width', x.bandwidth())

    if (props.axisSettings.ygridlines) {
      const yFormat = getFormat(
        props.axisSettings.yformat,
        props.axisSettings.yprecision
      )
      gridlines.call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .ticks(props.axisSettings.yticks)
          .tickFormat(yFormat)
      )
    }
  }
}

class BarChart extends Component {
  state = {
    mounted: false
  }

  componentDidMount() {
    updateD3Node(this.props, true)
    this.setState({ mounted: true })
  }

  componentWillReceiveProps(nextProps) {
    const transition =
      nextProps.moreSettings.barType !== this.props.moreSettings.barType
    if (this.state.mounted) updateD3Node(nextProps, transition)
  }

  render() {
    if (
      !this.props.dataTypes.includes('number') &&
      !this.props.dataTypes.includes('time')
    )
      return <Info info="no-number" text="bar chart" />

    return (
      <div id="chart">
        <SVGPanZoom {...this.props}>
          <svg width={this.props.width} height={this.props.height} />
        </SVGPanZoom>
      </div>
    )
  }
}

export default BarChart
