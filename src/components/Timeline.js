import React, { Component } from 'react'
import { getTimeData } from '../utils/convertData'
import * as d3 from 'd3'
import SVGPanZoom from './SVGPanZoom'
import { drawLegend } from '../utils/draw'
import { d3Timeline } from '../utils/timeline'
import Info from './Info'

// timeline reference: http://bl.ocks.org/denisemauldin/e6da337734f855c2a89666afb11dc329
const updateD3Node = (props) => {
  
  const [data, minDate, maxDate, colors, colorScale] = getTimeData(props)

  var svg = d3.select('#chart')

  svg = svg.select('g')
  svg.selectAll('*').remove()
  svg = svg.append('g')
    .attr('width', props.width)
    .attr('height', props.height)


  var padding = props.moreSettings.padding
  var singleHeight = (props.height-padding) / data.length
  if (singleHeight == null) return null
  var timeline = d3Timeline()

  let negativeHeight = false
  if (props.moreSettings.timelineType === 'separate') { // separate
    timeline = d3Timeline()
      .size([props.width-120, singleHeight-padding])
      .extent([minDate, maxDate])
      .padding(0)
      .maxBandHeight(props.height)

    data.forEach(function (period, i) {
    
      let band = timeline([period])
      if (band[0].dy <= 0) {
        negativeHeight = true
        return
      }
    
      svg.append('g')
        .attr('transform', 'translate(100,' + (padding + (i * singleHeight)) + ')')
        .selectAll('rect')
        .data(band)
        .enter()
        .append('rect')
        .attr('class', 'rect')
        .attr('rx', 2)
        .attr('x', function (d) {return d.start})
        .attr('y', function (d) {return d.y})
        .attr('height', function (d) {return d.dy})
        .attr('width', function (d) {return d.end - d.start})
        .attr('fill', function (d) {return colors[i] })
    
      svg.append('text')
        .text(period.label)
        .attr('y', padding + singleHeight*0.5 + (i * singleHeight))
        .attr('x', 20)
        .attr('alignment-baseline', 'middle')
        .style('font-size', props.moreSettings.fontSize)
    
    })

  } else { // grouped
    timeline = d3Timeline()
      .size([props.width-120, props.height-padding])
      .extent([minDate, maxDate])
      .padding(padding)
      .maxBandHeight(props.height)

    var theseBands = timeline(data)
    // check if all heights are positive
    if (!theseBands.map(b=>b.dy).every(h=>h>0)) {
      negativeHeight = true
      return negativeHeight
    }
    
    var g = svg.append('g')
      .attr('transform', 'translate(100,' + padding + ')')
      .selectAll('rect')
      .data(theseBands)
      .enter()

    g.append('rect')
      .attr('class', 'rect')
      .attr('rx', 2)
      .attr('x', function (d) {return d.start})
      .attr('y', function (d) {return d.y})
      .attr('height', function (d) {return d.dy})
      .attr('width', function (d) {return d.end - d.start})
      .attr('fill', function (d,i) {return colors[i]})
    
      
    g.append('text')
      .text(function(d) {return d.label})
      .attr('x', function (d) {return d.start+10})
      .attr('y', function (d) {return d.y + d.dy/2})
      .attr('alignment-baseline', 'middle')
      .style('font-size', props.moreSettings.fontSize)
  }

  if (colorScale != null) drawLegend(svg, colorScale, props)

  return negativeHeight
}
class Timeline extends Component {

  state = {
    mounted: false,
    negativeHeight: false
  }

  componentDidMount() {

    updateD3Node(this.props)
    this.setState({mounted: true})
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.mounted) {
      if (updateD3Node(nextProps)) {
        if (!this.state.negativeHeight) this.setState({ negativeHeight: true })
      } else {
        if (this.state.negativeHeight) this.setState({ negativeHeight: false })
      }
    }
  }

  render() {

    if (!this.props.dataTypes.includes('time')) return <Info info='no-time' />
    return (
      <div id='chart'>
        { this.state.negativeHeight &&
          <Info info='negative-height' showSettings={true} />
        }
        { !this.state.negativeHeight &&
          <SVGPanZoom {...this.props}>
            <svg width={this.props.width} height={this.props.height}></svg>
          </SVGPanZoom>
        }
      </div>
    )
  }
}

export default Timeline
