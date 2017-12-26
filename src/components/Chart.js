import React, { Component } from 'react';
import ScatterPlot from './ScatterPlot'

class Chart extends Component {
  state = {
    width: -1,
  }

  componentDidMount() {
    this.setState({width: this.chart.offsetWidth})
  }

  render() {
    const width = Math.max(this.state.width, 300)
    const styles = {
      width: width,
      height: width * 0.6,
      padding: 40,
    }

    return (
      <div ref={input => { this.chart = input }}>
        { Array.isArray(this.props.data) &&
          this.props.data.length > 1 && 
          <ScatterPlot {...this.props} {...styles} />
        }
      </div>
    )
  }
}

export default Chart
