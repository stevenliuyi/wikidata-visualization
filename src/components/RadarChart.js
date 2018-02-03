import React, { Component } from 'react'
import { getGroupValues } from '../utils/convertData'
import * as d3 from 'd3'
import SVGPanZoom from './SVGPanZoom'
import { drawLegend } from '../utils/draw'
import Radar from 'react-d3-radar'

class RadarChart extends Component {

  render() {

    const [data, maxVal, colors, colorScale] = getGroupValues(this.props)

    const d3node = (
      <Radar
        width={this.props.width}
        height={this.props.height}
        padding={70}
        domainMax={maxVal}
        data={data}
        colors={colors}
      />
    )

    d3.selectAll('.legendCells').remove()
    drawLegend(d3.select('#chart').select('svg'), colorScale, this.props)

    return (
      <div id='chart'>
        <SVGPanZoom d3node={d3node} {...this.props}/> 
      </div>
    )
  }
}

export default RadarChart
