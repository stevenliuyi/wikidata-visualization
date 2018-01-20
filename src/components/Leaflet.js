import React, { Component } from 'react'
import {
  Map,
  Marker,
  FeatureGroup
} from 'react-leaflet'
import Leaflet, { latLngBounds } from 'leaflet'
import Basemap from './Basemap'
import 'leaflet/dist/leaflet.css'

Leaflet.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/'

class LeafletMap extends Component {
  state = {
    lat: 0,
    lng: 0,
    zoom: 1
  }

  render() {

    // get coordinates
    const coordData = this.props.data.filter((item, i) => this.props.rowSelections.includes(i))
      .filter(item => item[this.props.header[this.props.settings['coordinate']]] != null)
      .map((item, i) => (item[this.props.header[this.props.settings['coordinate']]]
        .split(', ').map(parseFloat).reverse()))

    // get bounds
    const bounds = latLngBounds(coordData[0])
    coordData.forEach((coord) => { bounds.extend(coord) })

    // check if bounds is empty
    if (Object.keys(bounds).length === 0) {
      bounds.extend([90,180]).extend([-90,-180])
    }

    return (
      <div>
        <Map
          style={{height: 350}}
          bounds={bounds}>
          <Basemap basemap={this.props.moreSettings.baseMap} />
          <FeatureGroup>
            {
              coordData.map((coord, i) => 
                <Marker key={i} position={coord}>
                </Marker>
              )
            }
          </FeatureGroup>
        </Map>
      </div>
    )
  }
}

export default LeafletMap
