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
import { getColorScaleFromValues } from '../utils/scales'
import { mapSettings } from '../utils/maps'
import * as d3 from 'd3'
import { getGroupValues, getCoordArray } from '../utils/convertData'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import chroma from 'chroma-js'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import Info from './Info'
import { VictoryPie } from 'victory'

const wrapperStyles = {
  width: '100%',
  margin: '0 auto',
  marginBottom: '-5px' // make the border consistent with other charts
}

class PieChartMap extends Component {
  state = {
    center: [0, 20],
    zoom: 1,
    baseZoom: 1,
    colors: [],
    colorScale: null,
    y_labels: [],
    x_values: [],
    y_values: [],
    tooltipHTMLs: []
  }

  componentWillMount() {
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ center: mapSettings[nextProps.moreSettings.map].center })
    const [x_values, y_values, y_labels, tooltipHTMLs] = getGroupValues(
      this.props,
      false
    )
    const colorScale = getColorScaleFromValues(
      y_labels,
      this.props.moreSettings.color
    )
    this.setState({ x_values, y_values, y_labels, colorScale, tooltipHTMLs })
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

    d3.selectAll('.d3ToolTip').remove()
    var tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3ToolTip')

    d3
      .selectAll('.rsm-marker')
      .on('mouseover', (d, i) => {
        d3.select('#text' + i).attr('font-weight', 'bold')
        drawTooltip(this.state.tooltipHTMLs[i])
      })
      .on('mousemove', function() {
        updateTooltip()
      })
      .on('mouseout', function(d, i) {
        tooltip.style('display', 'none')
        d3.select('#text' + i).attr('font-weight', 'normal')
      })

    d3
      .selectAll('.pie')
      .selectAll('path')
      .on('mouseover', function(d, i) {
        d3
          .select(this)
          .style('fill', chroma(d3.select(this).style('fill')).brighten(0.6))
      })
      .on('mouseout', function(d, i) {
        d3
          .select(this)
          .style('fill', chroma(d3.select(this).style('fill')).darken(0.6))
      })

    // show legend
    if (this.state.colorScale != null) {
      d3.selectAll('.legendCells').remove()
      var svg = d3.select('.rsm-svg')
      drawLegend(svg, this.state.colorScale, this.props)
    }
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
      return <Info info="no-coordinate" text="pie chart map" />

    if (
      !this.props.dataTypes.includes('number') &&
      !this.props.dataTypes.includes('time')
    )
      return <Info info="no-number" text="pie chart map" />

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

    const radius = this.props.moreSettings.outerRadius
    const innerRadius = radius * this.props.moreSettings.innerRadius / 100

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
                        <g
                          className="pie"
                          transform={`translate(-${radius},-${radius})`}
                        >
                          <VictoryPie
                            standalone={false}
                            width={radius * 2}
                            height={radius * 2}
                            padding={0}
                            innerRadius={innerRadius}
                            style={{
                              labels: {
                                fill: this.props.moreSettings.showLabels
                                  ? 'black'
                                  : 'transparent',
                                fontSize: parseInt(
                                  this.props.moreSettings.fontSize,
                                  10
                                )
                              },
                              data: { stroke: '#ECEFF1' }
                            }}
                            labelRadius={radius * 1.1}
                            data={this.state.y_labels.map(
                              (group_label, group_idx) => {
                                return {
                                  x: group_label,
                                  y: this.state.y_values[group_idx][i],
                                  fill: this.state.colorScale(group_label)
                                }
                              }
                            )}
                          />
                        </g>
                        <text
                          id={`text${i}`}
                          textAnchor="middle"
                          y={
                            0.5 * parseInt(this.props.moreSettings.fontSize, 10)
                          }
                          style={{
                            fill: 'black',
                            fontSize: this.props.moreSettings.fontSize
                          }}
                        >
                          {this.state.x_values[i]}
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

export default PieChartMap
