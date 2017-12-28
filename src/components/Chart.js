import React, { Component } from 'react'
import Measure from 'react-measure'
import ScatterPlot from './ScatterPlot'
import BubbleChart from './BubbleChart'
import RadialTree from './RadialTree'

class Chart extends Component {
  state = {
    width: -1,
    show: false
  }

  componentWillMount() {
    if (Array.isArray(this.props.data) && this.props.data.length > 1) {
      this.setState({ show: true })
    } else {
      this.setState({ show: false })
    }
  }

  render() {
    const width = Math.max(this.state.width, 1)
    const styles = {
      width: width,
      height: width * 0.6,
      padding: 40,
    }

    return (
      <Measure
        bounds
        onResize={(contentRect) => {
          this.setState({ width: contentRect.bounds.width })
        }}
      >
        {({ measureRef }) =>
          <div ref={measureRef}>
            { (this.state.show) && (this.props.chartId === 1.2) &&
                <ScatterPlot {...this.props} {...styles} />
            }
            { (this.state.show) && (this.props.chartId === 1.3) &&
                <BubbleChart {...this.props} {...styles} />
            }
            { (this.state.show) && (this.props.chartId === 1.4) &&
                <RadialTree treeType='tree' {...this.props} {...styles} />
            }
            { (this.state.show) && (this.props.chartId === 1.5) &&
                <RadialTree treeType='cluster' {...this.props} {...styles} />
            }
          </div>
        }
      </Measure>
    )
  }
}

export default Chart
