import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from 'react-simple-maps'
import { Button, ButtonGroup } from 'react-bootstrap'
import { getRadius, getColors } from '../utils/scales'

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
}

class Map extends Component {
  state = {
    center: [0, 20],
    zoom: 1,
  }

  componentWillMount() {
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
  }

  handleZoomIn() {
    this.setState({ zoom: this.state.zoom * 2})
  }

  handleZoomOut() {
    this.setState({ zoom: this.state.zoom / 2})
  }

  render() {
    const radii = getRadius(this.props, 6, 60)
    const colors = getColors(this.props)

    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{
            scale: 205,
          }}
          width={980}
          height={551}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <ZoomableGroup center={this.state.center} zoom={this.state.zoom}>
            <Geographies geography="/maps/world-50m.json">
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                  geography.id !== 'ATA' && (
                    <Geography
                      key={i}
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: '#ECEFF1',
                          stroke: '#607D8B',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                        hover: {
                          fill: '#607D8B',
                          stroke: '#607D8B',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                        pressed: {
                          fill: '#607D8B',
                          stroke: '#607D8B',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                      }}
                    />
                  ))}
            </Geographies>
            <Markers>
              {
                this.props.data.map((item, i) => (
                  <Marker key={i} marker={{ coordinates:
                      item[this.props.header[this.props.settings['coordinate']]].split(', ').map(parseFloat) }}>
                    <circle
                      cx={0}
                      cy={0}
                      r={radii[i]}
                      fill={colors[i]}
                      opacity={0.8}
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <text
                      textAnchor='middle'
                      y={-5}
                      style={{
                        fontFamily: 'sans-serif',
                        fill: 'black',
                        opacity: '0,7',
                        fontSize: '16px'
                      }}>
                      { item[this.props.header[this.props.settings['label']]] }
                    </text>
                  </Marker>
                ))
              }
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
        <ButtonGroup>
          <Button onClick={this.handleZoomOut}>-</Button>
          <Button onClick={this.handleZoomIn}>+</Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default Map
