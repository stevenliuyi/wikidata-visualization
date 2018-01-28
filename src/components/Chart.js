import React, { Component } from 'react'
import Measure from 'react-measure'
import ScatterPlot from './ScatterPlot'
import BubbleChart from './BubbleChart'
import RadialTree from './RadialTree'
import Tree from './Tree'
import ChordDiagram from './ChordDiagram'
import Map from './Map'
import Graph from './Graph'
import CartogramMap from './CartogramMap'
import ChoroplethMap from './ChoroplethMap'
import SankeyDiagram from './SankeyDiagram'
import Heatmap from './Heatmap'
import LeafletMap from './Leaflet'
import Tools from './Tools'

class Chart extends Component {
  state = {
    width: -1,
    show: false
  }

  componentWillMount() {
    if (Array.isArray(this.props.data) && this.props.data.length > 1 && this.props.rowSelections.length > 0) {
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
      <div>
        <Measure
          bounds
          onResize={(contentRect) => {
            this.setState({ width: contentRect.bounds.width })
          }}
        >
          {({ measureRef }) =>
            <div ref={measureRef}>
              { (this.state.show) && (this.props.chartId === 1.02) &&
                  <ScatterPlot {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.03) &&
                  <BubbleChart {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.04) &&
                  <RadialTree treeType='tree' {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.05) &&
                  <RadialTree treeType='cluster' {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.06) &&
                  <Tree treeType='tree' {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.07) &&
                  <Tree treeType='cluster' {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.08) &&
                  <ChordDiagram {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.09) &&
                  <Map {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.10) &&
                  <Graph {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.11) &&
                  <CartogramMap {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.13) &&
                  <ChoroplethMap {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.14) &&
                  <SankeyDiagram {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.15) &&
                  <Heatmap {...this.props} {...styles} />
              }
              { (this.state.show) && (this.props.chartId === 1.16) &&
                  <LeafletMap {...this.props} {...styles} />
              }
            </div>
          }
        </Measure>
        { (this.state.show) && (this.props.chartId !== 1.16) &&
          <Tools />
        } 
      </div>
    )
  }
}

export default Chart
