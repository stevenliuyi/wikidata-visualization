import React, { Component } from 'react'

const renderLabels = props => {
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
    const labelProps = {
      id: `text${index}`,
      className: 'circleLabel',
      x: props.xScale(parseXData(item[props.xLabel])),
      y: props.yScale(parseYData(item[props.yLabel])),
      opacity: 0.7,
      fontSize: props.moreSettings.fontSize,
      key: index
    }
    const label = props.header[props.settings['label']]
    return <text {...labelProps}>{item[label]}</text>
  }
}

class Labels extends Component {
  render() {
    return (
      <g>
        {this.props.data
          .filter((item, i) => this.props.rowSelections.includes(i))
          .map(renderLabels(this.props))}
      </g>
    )
  }
}

export default Labels
