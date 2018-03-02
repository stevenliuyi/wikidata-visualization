import React, { Component } from 'react'
import {
  Map,
  Marker,
  CircleMarker,
  Tooltip,
  FeatureGroup,
  Polyline
} from 'react-leaflet'
import Leaflet, { latLngBounds } from 'leaflet'
import Basemap from './Basemap'
import { getRadius, getColors } from '../utils/scales'
import { getTooltipHTML, getCoordArray } from '../utils/convertData'
import { drawLegend } from '../utils/draw'
import 'leaflet/dist/leaflet.css'
import Info from './Info'
import Arc from './Arc'
import DivIcon from 'react-leaflet-div-icon'
import * as d3 from 'd3'

Leaflet.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/'

class LeafletMap extends Component {
  state = {
    lat: 0,
    lng: 0,
    zoom: 1
  }

  componentWillMount() {
    this.fitBounds = this.fitBounds.bind(this)
    this.convertCoord = this.convertCoord.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.moreSettings.solarSystem !== nextProps.moreSettings.solarSystem
    ) {
      this.refs.map.leafletElement.options.crs =
        nextProps.moreSettings.solarSystem !== 'Earth'
          ? Leaflet.CRS.Simple
          : Leaflet.CRS.EPSG3857
      this.fitBounds()
    }
  }

  componentDidUpdate() {
    if (document.getElementsByClassName('info-text').length !== 0) return

    this.refs.map.leafletElement.invalidateSize(false)

    // show legends
    const colorScale = getColors(this.props, true)[1]
    d3.selectAll('.d3ToolTip').remove()
    d3
      .select('body')
      .append('div')
      .attr('class', 'd3ToolTip')
    d3.selectAll('.legendCells').remove()
    let svg = d3.select('#map-legend').select('svg')
    drawLegend(svg, colorScale, this.props)

    // render math formulas in tooltip
    if (this.props.dataTypes.includes('formula') && window.MathJax != null)
      d3.selectAll('.map-tooltip').call(function() {
        window.MathJax.Hub.Queue([
          'Typeset',
          window.MathJax.Hub,
          d3.select(this).node()
        ])
      })
  }

  componentDidMount() {
    if (document.getElementsByClassName('info-text').length !== 0) return

    this.props.updateFitBoundsFcn(this.fitBounds)
    this.fitBounds()
  }

  fitBounds() {
    this.refs.map.leafletElement.fitBounds(this.getBounds(this.props))
  }

  // convert coordinates
  convertCoord(coord) {
    const body = this.props.moreSettings.solarSystem
    if (body === 'Mars' || body === 'Triton') {
      return coord[1] > 180 ? [coord[0], coord[1] - 360] : coord
    } else if (
      body === 'Pluto' ||
      body === 'Enceladus' ||
      body === 'Tethys' ||
      body === 'Rhea' ||
      body === 'Titan'
    ) {
      return coord[1] < 0 ? [coord[0], coord[1] + 360] : coord
    } else if (body === 'Mercury' || body === 'Io') {
      let new_coord = coord[1] < -180 ? [coord[0], coord[1] + 360] : coord
      return new_coord[1] > 180 ? [new_coord[0], new_coord[1] - 360] : new_coord
    } else if (body === 'Venus') {
      return coord[1] > 240 ? [coord[0], coord[1] - 360] : coord
    } else if (body === 'Dione') {
      return coord[1] < -180 ? [coord[0], coord[1] + 360] : coord
    } else {
      return coord
    }
  }

  getBounds(props) {
    // get coordinates
    const coordData = props.data
      .filter((item, i) => props.rowSelections.includes(i))
      .filter(item => item[props.header[props.settings['coordinate']]] != null)
      .map((item, i) =>
        getCoordArray(
          item[props.header[props.settings['coordinate']]]
        ).reverse()
      )
      .map(coord => this.convertCoord(coord))

    // get bounds
    const bounds = latLngBounds(coordData[0])
    coordData.forEach(coord => {
      bounds.extend(coord)
    })

    // check if bounds is empty
    if (Object.keys(bounds).length === 0) {
      bounds.extend([90, 180]).extend([-90, -180])
    }

    return bounds
  }

  render() {
    if (!this.props.dataTypes.includes('coordinate'))
      return <Info info="no-coordinate" text="map" />

    const bounds = this.getBounds(this.props)

    const radii = getRadius(this.props)
    const colors = getColors(this.props)
    const tooltipHTMLs = getTooltipHTML(this.props)

    return (
      <div>
        <div
          id="map-legend"
          style={{ position: 'absolute', zIndex: 1000, pointerEvents: 'none' }}
        >
          <svg width={this.props.width} height={this.props.height} />
        </div>
        <Map
          ref="map"
          crs={
            this.props.moreSettings.solarSystem !== 'Earth'
              ? Leaflet.CRS.Simple
              : Leaflet.CRS.EPSG3857
          }
          style={{ height: this.props.height, width: this.props.width }}
          bounds={bounds}
          attributionControl={false}
        >
          <Basemap
            solarSystem={this.props.moreSettings.solarSystem}
            basemap={this.props.moreSettings.baseMap}
            highRes={this.props.moreSettings.mapResolution}
          />
          {// coordinates
          this.props.data
            .filter((item, i) => this.props.rowSelections.includes(i))
            .map((item, i) => {
              if (
                item[this.props.header[this.props.settings['coordinate']]] !=
                null
              ) {
                let coord = getCoordArray(
                  item[this.props.header[this.props.settings['coordinate']]]
                ).reverse()

                coord = this.convertCoord(coord)
                const label =
                  item[this.props.header[this.props.settings['label']]]

                if (coord.length === 2) {
                  return (
                    <FeatureGroup key={i}>
                      {this.props.moreSettings.showMarkers && (
                        <Marker position={coord}>
                          <Tooltip>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: tooltipHTMLs[i]
                              }}
                            />
                          </Tooltip>
                        </Marker>
                      )}
                      {this.props.moreSettings.showCircles && (
                        <CircleMarker
                          center={coord}
                          color="white"
                          weight={1}
                          fill={true}
                          fillColor={colors[i]}
                          fillOpacity={0.7}
                          radius={parseFloat(radii[i])}
                        >
                          <Tooltip>
                            <div
                              className="map-tooltip"
                              dangerouslySetInnerHTML={{
                                __html: tooltipHTMLs[i]
                              }}
                            />
                          </Tooltip>
                        </CircleMarker>
                      )}
                      {label != null && (
                        <DivIcon position={coord}>
                          <div
                            style={{
                              transform: 'translate(0, -15px)',
                              fontSize: this.props.moreSettings.fontSize,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {label}
                          </div>
                        </DivIcon>
                      )}
                    </FeatureGroup>
                  )
                }
              }
              return null
            })}
          {// linkes between coordinates
          this.props.data
            .filter((item, i) => this.props.rowSelections.includes(i))
            .map((item, i) => {
              if (
                item[
                  this.props.header[this.props.settings['coordinate_from']]
                ] != null &&
                item[this.props.header[this.props.settings['coordinate_to']]] !=
                  null
              ) {
                let coord_from = getCoordArray(
                  item[
                    this.props.header[this.props.settings['coordinate_from']]
                  ]
                ).reverse()

                let coord_to = getCoordArray(
                  item[this.props.header[this.props.settings['coordinate_to']]]
                ).reverse()

                coord_from = this.convertCoord(coord_from)
                coord_to = this.convertCoord(coord_to)

                if (coord_from.length === 2 && coord_to.length === 2) {
                  if (
                    coord_from[0] === coord_to[0] &&
                    coord_from[1] === coord_to[1]
                  )
                    return null
                  return this.props.moreSettings.lineType === 'geodesic' ? (
                    <Arc
                      key={i}
                      position={{ from: coord_from, to: coord_to }}
                      options={{
                        color: '#999',
                        weight: this.props.moreSettings.lineWidth,
                        opacity: 0.5,
                        vertices: 100,
                        offset: 10
                      }}
                      onMouseover={e => e.target.setStyle({ color: '#337ab7' })}
                      onMouseout={e => e.target.setStyle({ color: '#999' })}
                    />
                  ) : (
                    <Polyline
                      positions={[coord_from, coord_to]}
                      color="#999"
                      weight={this.props.moreSettings.lineWidth}
                      opacity={0.5}
                      onMouseover={e => e.target.setStyle({ color: '#337ab7' })}
                      onMouseout={e => e.target.setStyle({ color: '#999' })}
                    />
                  )
                }
              }
              return null
            })}
        </Map>
      </div>
    )
  }
}

export default LeafletMap
