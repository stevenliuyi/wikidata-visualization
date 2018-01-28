import React, { Component } from 'react'

const renderLabels = (props) => {
  return (item, index) => {
    const labelProps = {
      id: `text${index}`,
      className: 'circleLabel',
      x: props.xScale(parseFloat(item[props.xLabel])),
      y: props.yScale(parseFloat(item[props.yLabel])),
      opacity: 0.7,
      fontSize: props.moreSettings.fontSize,
      key: index
    }
    const label = props.header[props.settings['label']]
    return (
      <text {...labelProps}>
        { item[label] }
      </text>
    )
  }
}

class Labels extends Component {
  render() {
    return (
      <g>
        {
          this.props.data.filter((item, i) => this.props.rowSelections.includes(i))
            .map(renderLabels(this.props))
        }
      </g>
    )
  }
}

export default Labels
