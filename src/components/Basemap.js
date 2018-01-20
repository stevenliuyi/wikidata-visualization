import React, { Component } from 'react'
import { TileLayer } from 'react-leaflet'
import { baseMapSettings } from '../utils/basemap'

class Basemap extends Component {
  state = {
    basemap: 'OpenStreetMap'
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.basemap != null) this.setState({ basemap: nextProps.basemap })
  }

  render() {
    return (
      <TileLayer
        attribution={ baseMapSettings[this.state.basemap].attribution }
        url={ baseMapSettings[this.state.basemap].url }
      />
    )
  }
}

export default Basemap
