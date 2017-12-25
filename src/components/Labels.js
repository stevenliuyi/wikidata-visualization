import React, { Component } from 'react';

const renderLabels = (props) => {
  return (item, index) => {
    const labelProps = {
      x: props.xScale(parseFloat(item[props.xLabel])),
      y: props.yScale(parseFloat(item[props.yLabel])),
      opacity: 0.5,
      key: index
    }
    const label = props.header[props.settings['label']]
    return (
      <text {...labelProps}>
        { item[label] }
      </text>
    );
  };
};

class Labels extends Component {
  render() {
    return (
      <g>
        {
          this.props.data.map(renderLabels(this.props))
        }
      </g>
    )
  }
}

export default Labels
