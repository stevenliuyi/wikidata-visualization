import React, { Component } from 'react'
import {
  Map,
  Marker,
  CircleMarker,
  Tooltip,
  FeatureGroup
} from 'react-leaflet'
import Leaflet, { latLngBounds } from 'leaflet'
import Basemap from './Basemap'
import { getRadius, getColors } from '../utils/scales'
import { getTooltipHTML } from '../utils/convertData'
import 'leaflet/dist/leaflet.css'
import Info from './Info'

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
    if (this.props.moreSettings.solarSystem !== nextProps.moreSettings.solarSystem) {
      this.refs.map.leafletElement.options.crs = (nextProps.moreSettings.solarSystem!=='Earth') ? Leaflet.CRS.Simple : Leaflet.CRS.EPSG3857
      this.fitBounds()
    }
  }

  componentDidUpdate() {
    if (document.getElementsByClassName('info-text').length !== 0) return

    this.refs.map.leafletElement.invalidateSize(false)
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
      return (coord[1] > 180) ? [coord[0], coord[1]-360] : coord
    } else if (body === 'Pluto' || body === 'Enceladus' || body === 'Tethys' || body === 'Rhea' || body === 'Titan') {
      return (coord[1] < 0) ? [coord[0], coord[1]+360] : coord
    } else if (body === 'Mercury' || body === 'Io') {
      let new_coord = (coord[1] < -180) ? [coord[0], coord[1]+360] : coord
      return (new_coord[1] > 180) ? [new_coord[0], new_coord[1]-360] : new_coord
    } else if (body === 'Venus') {
      return (coord[1] > 240) ? [coord[0], coord[1]-360] : coord
    } else if (body === 'Dione') {
      return (coord[1] < -180) ? [coord[0], coord[1]+360] : coord
    } else {
      return coord
    }
  }

  getBounds(props) {
    // get coordinates
    const coordData = props.data.filter((item, i) => props.rowSelections.includes(i))
      .filter(item => item[props.header[props.settings['coordinate']]] != null)
      .map((item, i) => (item[props.header[props.settings['coordinate']]]
        .split(', ').map(parseFloat).reverse()))
      .map(coord => this.convertCoord(coord))

    // get bounds
    const bounds = latLngBounds(coordData[0])
    coordData.forEach((coord) => { bounds.extend(coord) })

    // check if bounds is empty
    if (Object.keys(bounds).length === 0) {
      bounds.extend([90,180]).extend([-90,-180])
    }

    return bounds
  }

  render() {

    if (!this.props.dataTypes.includes('coordinate')) return <Info info='no-coordinate' />

    const bounds = this.getBounds(this.props)

    const radii = getRadius(this.props)
    const colors = getColors(this.props)
    const tooltipHTMLs = getTooltipHTML(this.props)

    return (
      <div>
        <Map
          ref='map'
          crs={(this.props.moreSettings.solarSystem!=='Earth') ? Leaflet.CRS.Simple : Leaflet.CRS.EPSG3857}
          style={{height: this.props.height, width: this.props.width}}
          bounds={bounds}
          attributionControl={false}>
          <Basemap
            solarSystem={this.props.moreSettings.solarSystem}
            basemap={this.props.moreSettings.baseMap} />
          {
            this.props.data.filter((item, i) => this.props.rowSelections.includes(i))
              .map((item, i) => {
                if (item[this.props.header[this.props.settings['coordinate']]] != null) {
                  let coord = item[this.props.header[this.props.settings['coordinate']]]
                    .split(', ').map(parseFloat).reverse()
                
                  coord = this.convertCoord(coord)
                  
                  if (coord.length === 2) {
                    return (
                      <FeatureGroup key={i}>
                        { this.props.moreSettings.showMarkers && (
                          <Marker position={coord}>
                            <Tooltip>
                              <div dangerouslySetInnerHTML={{ __html: tooltipHTMLs[i] }} />
                            </Tooltip>
                          </Marker>
                        )
                        }
                        { this.props.moreSettings.showCircles && (
                          <CircleMarker
                            center={coord}
                            color='white'
                            weight={1}
                            fill={true}
                            fillColor={colors[i]}
                            fillOpacity={0.7}
                            radius={parseFloat(radii[i])}>
                            <Tooltip>
                              <div dangerouslySetInnerHTML={{ __html: tooltipHTMLs[i] }} />
                            </Tooltip>
                          </CircleMarker>
                        )
                        }
                      </FeatureGroup>
                    )
                  }
                }
                return null
              })
          }
        </Map>
      </div>
    )
  }
}

export default LeafletMap
