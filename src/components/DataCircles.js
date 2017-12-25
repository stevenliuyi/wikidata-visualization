import React, { Component } from 'react';
import { interpolateSpectral } from 'd3-scale-chromatic';

const renderCircles = (props, colors) => {
  return (item, index) => {
    const circleProps = {
      cx: props.xScale(parseFloat(item[props.xLabel])),
      cy: props.yScale(parseFloat(item[props.yLabel])),
      r: 3,
      fill: colors[index],
      key: index
    }
    return <circle {...circleProps} />
  }
}

const getColors = (props) => {
  let colors = Array(props.data.length).fill(interpolateSpectral(1))
  if (props.settings['color'] !== -1) {
    const values = props.data.map(item => item[props.header[props.settings['color']]])
    const unique_values = [...new Set(values)].sort()
    // generate uniformly distributed points in [0, 1] and map to color scheme
    const scheme = [...Array(unique_values.length).keys()]
      .map( v => interpolateSpectral(v / (unique_values.length-1)) )
    colors = values.map(value => scheme[unique_values.indexOf(value)])
  }
  return colors
}

class DataCircles extends Component {
  render() {
    const colors = getColors(this.props)

    return (
      <g>
        {
          this.props.data.map(renderCircles(this.props, colors))
        }
      </g>
    )
  }
}

export default DataCircles
