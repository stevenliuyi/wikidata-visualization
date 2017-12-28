import React, { Component } from 'react'

const renderCircles = (props) => {
  return (item, index) => {
    const circleProps = {
      cx: props.xScale(parseFloat(item[props.xLabel])),
      cy: props.yScale(parseFloat(item[props.yLabel])),
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
        {
          this.props.data.map(renderCircles(this.props))
        }
      </g>
    )
  }
}

export default DataCircles
