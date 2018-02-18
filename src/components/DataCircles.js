import React, { Component } from 'react'

const renderCircles = props => {
  const parseXData =
    props.dataTypes[props.settings['x-axis']] === 'number'
      ? parseFloat
      : d => new Date(d)

  const parseYData =
    props.dataTypes[props.settings['y-axis']] === 'number'
      ? parseFloat
      : d => new Date(d)

  return (item, index) => {
    if (item[props.xLabel] == null || item[props.yLabel] == null) return null
    const circleProps = {
      id: `circle${index}`,
      className: 'circle',
      cx: props.xScale(parseXData(item[props.xLabel])),
      cy: props.yScale(parseYData(item[props.yLabel])),
      r: props.radii[index],
      fill: props.colors[index],
      opacity: 0.8,
      key: index
    }
    return <circle {...circleProps} />
  }
}

class DataCircles extends Component {
  render() {
    return (
      <g>
        {this.props.data
          .filter((item, i) => this.props.rowSelections.includes(i))
          .map(renderCircles(this.props))}
      </g>
    )
  }
}

export default DataCircles
