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
import { mapSettings } from '../utils/maps'
import * as d3 from 'd3'
import { getTooltipHTML } from '../utils/convertData'

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
}

class Map extends Component {
  state = {
    center: [0, 20],
    zoom: 1
  }

  componentWillMount() {
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ center: mapSettings[nextProps.moreSettings.map].center })
    this.setState({ center: [100,90]})
    this.setState({ center: mapSettings[nextProps.moreSettings.map].center })
  }

  componentDidMount() {

    const tooltipHTMLs = getTooltipHTML(this.props)

    d3.selectAll('.d3ToolTip').remove()
    var tooltip = d3.select('body').append('div').attr('class', 'd3ToolTip')

    d3.selectAll('.rsm-marker')
    .on('mousemove', function(d,i) {
      tooltip
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY + 10 + 'px')
        .style('display', 'inline-block')
        .html(tooltipHTMLs[i])
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none')
    })

  }

  handleZoomIn() {
    this.setState({ zoom: this.state.zoom * 2})
  }

  handleZoomOut() {
    this.setState({ zoom: this.state.zoom / 2})
  }

  render() {

    const radii = getRadius(this.props)
    const colors = getColors(this.props)

    const json_filename = (process.env.NODE_ENV === 'development')
      ? `/maps/${mapSettings[this.props.moreSettings.map].filename}`
      : `/wikidata-visualization/maps/${mapSettings[this.props.moreSettings.map].filename}`

    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection={this.props.moreSettings.projection}
          projectionConfig={{
            scale: mapSettings[this.props.moreSettings.map].scale,
            rotation: mapSettings[this.props.moreSettings.map].rotation
          }}
          width={980}
          height={551}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <ZoomableGroup center={this.state.center} zoom={this.state.zoom}>
            <Geographies geography={json_filename}>
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
                this.props.data.filter((item, i) => this.props.rowSelections.includes(i))
                  .map((item, i) => {
                    if (item[this.props.header[this.props.settings['coordinate']]] != null) {
                      return (
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
                              fontSize: this.props.moreSettings.fontSize
                            }}>
                            { item[this.props.header[this.props.settings['label']]] }
                          </text>
                        </Marker>
                      )
                    }
                    return null
                  })
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
