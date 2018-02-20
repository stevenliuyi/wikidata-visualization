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
import chroma from 'chroma-js'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import Info from './Info'
import * as d3Geo from 'd3-geo'

const wrapperStyles = {
  width: '100%',
  margin: '0 auto'
}

class Map extends Component {
  state = {
    center: [0, 20],
    zoom: 1,
    colors: []
  }

  componentWillMount() {
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
    this.setState({ colors: getColors(this.props) })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ center: mapSettings[nextProps.moreSettings.map].center })
    this.setState({ center: [100, 90] })
    this.setState({ center: mapSettings[nextProps.moreSettings.map].center })
    this.setState({ colors: getColors(nextProps) })
    this.setState({
      zoom: Math.min(nextProps.width / 980, nextProps.height / 551)
    })
  }

  componentDidUpdate() {
    const tooltipHTMLs = getTooltipHTML(this.props)

    d3.selectAll('.d3ToolTip').remove()
    var tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3ToolTip')

    const colors = this.state.colors
    d3
      .selectAll('.rsm-marker')
      .on('mouseover', function(d, i) {
        d3.select('#circle' + i).attr('fill', chroma(colors[i]).brighten(0.6))
        d3.select('#text' + i).attr('font-weight', 'bold')
      })
      .on('mousemove', function(d, i) {
        tooltip
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY + 10 + 'px')
          .style('display', 'inline-block')
          .html(tooltipHTMLs[i])
      })
      .on('mouseout', function(d, i) {
        tooltip.style('display', 'none')
        d3.select('#circle' + i).attr('fill', colors[i])
        d3.select('#text' + i).attr('font-weight', 'normal')
      })
  }

  handleZoomIn() {
    this.setState({ zoom: this.state.zoom * 2 })
  }

  handleZoomOut() {
    this.setState({ zoom: this.state.zoom / 2 })
  }

  render() {
    if (!this.props.dataTypes.includes('coordinate'))
      return <Info info="no-coordinate" />

    const radii = getRadius(this.props)

    const json_filename =
      process.env.NODE_ENV === 'development'
        ? `/maps/${mapSettings[this.props.moreSettings.map].filename}`
        : `/wikidata-visualization/maps/${
            mapSettings[this.props.moreSettings.map].filename
          }`

    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection={this.props.moreSettings.projection}
          projectionConfig={{
            scale: mapSettings[this.props.moreSettings.map].scale,
            rotation: mapSettings[this.props.moreSettings.map].rotation
          }}
          width={this.props.width}
          height={this.props.height}
          style={{
            width: this.props.width,
            height: this.props.height
          }}
        >
          <ZoomableGroup
            center={this.state.center}
            zoom={this.state.zoom}
            ref={node => (this.zoomableGroup = node)}
          >
            <Geographies geography={json_filename} disableOptimization>
              {(geographies, projection) =>
                geographies.map(
                  (geography, i) =>
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
                            outline: 'none'
                          },
                          hover: {
                            fill: '#607D8B',
                            stroke: '#607D8B',
                            strokeWidth: 0.75,
                            outline: 'none'
                          },
                          pressed: {
                            fill: '#607D8B',
                            stroke: '#607D8B',
                            strokeWidth: 0.75,
                            outline: 'none'
                          }
                        }}
                      />
                    )
                )
              }
            </Geographies>
            <g>
              {// links between coordinates
              this.zoomableGroup != null &&
                this.props.data
                  .filter((item, i) => this.props.rowSelections.includes(i))
                  .map((item, i) => {
                    if (
                      item[
                        this.props.header[
                          this.props.settings['coordinate_from']
                        ]
                      ] != null &&
                      item[
                        this.props.header[this.props.settings['coordinate_to']]
                      ] != null
                    ) {
                      const coordinate_from = item[
                        this.props.header[
                          this.props.settings['coordinate_from']
                        ]
                      ]
                        .split(', ')
                        .map(parseFloat)
                      const coordinate_to = item[
                        this.props.header[this.props.settings['coordinate_to']]
                      ]
                        .split(', ')
                        .map(parseFloat)
                      const projection = this.zoomableGroup.props.projection()
                      const path = d3Geo.geoPath().projection(projection)
                      return (
                        <g key={i}>
                          {this.props.moreSettings.lineType === 'geodesic' && (
                            <path
                              d={path({
                                type: 'LineString',
                                coordinates: [coordinate_from, coordinate_to]
                              })}
                              fill="transparent"
                              stroke="#999"
                              strokeOpacity={0.5}
                              strokeWidth={this.props.moreSettings.lineWidth}
                              pointerEvents="none"
                            />
                          )}
                          {this.props.moreSettings.lineType ===
                            'straight line' && (
                            <line
                              x1={projection(coordinate_from)[0]}
                              y1={projection(coordinate_from)[1]}
                              x2={projection(coordinate_to)[0]}
                              y2={projection(coordinate_to)[1]}
                              stroke="#999"
                              strokeOpacity={0.5}
                              strokeWidth={this.props.moreSettings.lineWidth}
                            />
                          )}
                        </g>
                      )
                    }
                    return null
                  })}
            </g>
            <Markers>
              {this.props.data
                .filter((item, i) => this.props.rowSelections.includes(i))
                .map((item, i) => {
                  if (
                    item[
                      this.props.header[this.props.settings['coordinate']]
                    ] != null
                  ) {
                    return (
                      <Marker
                        key={i}
                        marker={{
                          coordinates: item[
                            this.props.header[this.props.settings['coordinate']]
                          ]
                            .split(', ')
                            .map(parseFloat)
                        }}
                      >
                        <circle
                          id={`circle${i}`}
                          cx={0}
                          cy={0}
                          r={radii[i]}
                          fill={this.state.colors[i]}
                          opacity={0.8}
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <text
                          id={`text${i}`}
                          textAnchor="middle"
                          y={-5}
                          style={{
                            fontFamily: 'sans-serif',
                            fill: 'black',
                            opacity: '0,7',
                            fontSize: this.props.moreSettings.fontSize
                          }}
                        >
                          {
                            item[
                              this.props.header[this.props.settings['label']]
                            ]
                          }
                        </text>
                      </Marker>
                    )
                  }
                  return null
                })}
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
        <ButtonGroup className="zoom-button">
          <Button onClick={this.handleZoomOut}>
            <FaMinus size={12} />
          </Button>
          <Button onClick={this.handleZoomIn}>
            <FaPlus size={12} />
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default Map
