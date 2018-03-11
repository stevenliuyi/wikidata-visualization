import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  ZoomableGlobe,
  Geographies,
  Geography,
  Markers,
  Marker
} from 'react-simple-maps'
import { Button, ButtonGroup } from 'react-bootstrap'
import { getRadius, getColors } from '../utils/scales'
import { mapSettings } from '../utils/maps'
import * as d3 from 'd3'
import { getTooltipHTML, getCoordArray } from '../utils/convertData'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import chroma from 'chroma-js'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import Info from './Info'
import * as d3Geo from 'd3-geo'

const wrapperStyles = {
  width: '100%',
  margin: '0 auto',
  marginBottom: '-5px' // make the border consistent with other charts
}

class Map extends Component {
  state = {
    center: [0, 20],
    zoom: 1,
    baseZoom: 1,
    colors: [],
    colorScale: null
  }

  componentWillMount() {
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
    const [colors, colorScale] = getColors(this.props, true)
    this.setState({ colors, colorScale })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ center: mapSettings[nextProps.moreSettings.map].center })
    const [colors, colorScale] = getColors(nextProps, true)
    this.setState({ colors, colorScale })
    this.setState({
      zoom: Math.min(nextProps.width / 980, nextProps.height / 551),
      baseZoom: Math.min(nextProps.width / 980, nextProps.height / 551)
    })

    // zoom
    d3
      .select('.rsm-svg')
      .call(this.zoom)
      .on('mousedown.zoom', null)
      .on('touchstart.zoom', null)
      .on('touchmove.zoom', null)
      .on('touchend.zoom', null)
  }

  componentDidUpdate() {
    if (this !== this.props.viewer) this.props.onViewerChange(this)

    if (d3.event != null) return

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
        drawTooltip(tooltipHTMLs[i])
      })
      .on('mousemove', function() {
        updateTooltip()
      })
      .on('mouseout', function(d, i) {
        tooltip.style('display', 'none')
        d3.select('#circle' + i).attr('fill', colors[i])
        d3.select('#text' + i).attr('font-weight', 'normal')
      })

    // show legend
    if (this.state.colorScale != null) {
      d3.selectAll('.legendCells').remove()
      var svg = d3.select('.rsm-svg')
      drawLegend(svg, this.state.colorScale, this.props)
    }

    // path hover behavior
    d3
      .selectAll('.coord-path')
      .on('mouseover', function() {
        d3.select(this).attr('stroke', '#337ab7')
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke', '#999')
      })
  }

  zoom = d3.zoom().on('zoom', () => {
    this.setState({ zoom: d3.event.transform.k * this.state.baseZoom })
  })

  handleZoomIn() {
    this.setState({ zoom: this.state.zoom * 2 })
  }

  handleZoomOut() {
    this.setState({ zoom: this.state.zoom / 2 })
  }

  render() {
    if (!this.props.dataTypes.includes('coordinate'))
      return <Info info="no-coordinate" text="map" />

    const radii = getRadius(this.props)

    const json_filename =
      process.env.NODE_ENV === 'development'
        ? `/maps/json/${mapSettings[this.props.moreSettings.map].filename}`
        : `${process.env.PUBLIC_URL}/maps/json/${
            mapSettings[this.props.moreSettings.map].filename
          }`

    const Zoomable =
      this.props.moreSettings.projection !== 'orthographic'
        ? ZoomableGroup
        : ZoomableGlobe

    return (
      <div id="chart" style={wrapperStyles}>
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
          <Zoomable
            center={this.state.center}
            zoom={this.state.zoom}
            onMoveEnd={newCenter => this.setState({ center: newCenter })}
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
                      const coordinate_from = getCoordArray(
                        item[
                          this.props.header[
                            this.props.settings['coordinate_from']
                          ]
                        ]
                      )
                      const coordinate_to = getCoordArray(
                        item[
                          this.props.header[
                            this.props.settings['coordinate_to']
                          ]
                        ]
                      )
                      const projection = this.zoomableGroup.props.projection
                      const path = d3Geo.geoPath().projection(projection)
                      return (
                        <g key={i}>
                          {this.props.moreSettings.lineType === 'geodesic' && (
                            <path
                              className="coord-path"
                              d={path({
                                type: 'LineString',
                                coordinates: [coordinate_from, coordinate_to]
                              })}
                              fill="transparent"
                              stroke="#999"
                              strokeOpacity={0.5}
                              strokeWidth={this.props.moreSettings.lineWidth}
                              pointerEvents="visibleStroke"
                            />
                          )}
                          {this.props.moreSettings.lineType ===
                            'straight line' && (
                            <line
                              className="coord-path"
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
                          coordinates: getCoordArray(
                            item[
                              this.props.header[
                                this.props.settings['coordinate']
                              ]
                            ]
                          )
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
          </Zoomable>
        </ComposableMap>
        {// add zoom buttons on touch screens as a workaround
        ('ontouchstart' in window || navigator.msMaxTouchPoints) && (
          <ButtonGroup className="zoom-button">
            <Button onClick={this.handleZoomOut}>
              <FaMinus size={12} />
            </Button>
            <Button onClick={this.handleZoomIn}>
              <FaPlus size={12} />
            </Button>
          </ButtonGroup>
        )}
      </div>
    )
  }
}

export default Map
