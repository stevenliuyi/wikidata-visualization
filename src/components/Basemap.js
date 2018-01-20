import React, { Component } from 'react'
import { TileLayer, LayersControl } from 'react-leaflet'
import { baseMapSettings } from '../utils/basemap'

const { Overlay } = LayersControl

class Basemap extends Component {
  state = {
    basemap: 'OpenStreetMap'
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.basemap != null) this.setState({ basemap: nextProps.basemap })
  }

  render() {
    return (
      <div>
        { baseMapSettings[this.state.basemap].overlay == null &&
          (
            <TileLayer
              attribution={ baseMapSettings[this.state.basemap].attribution }
              url={ baseMapSettings[this.state.basemap].url }
            />
          )
        }
    
        { baseMapSettings[this.state.basemap].overlay != null &&
          (
            <LayersControl position='topright'>
              <TileLayer
                attribution={ baseMapSettings[this.state.basemap].attribution }
                url={ baseMapSettings[this.state.basemap].url }
              />
              <Overlay checked name={ baseMapSettings[this.state.basemap].overlay.name }>
                <TileLayer
                  attribution={ baseMapSettings[this.state.basemap].attribution }
                  url={ baseMapSettings[this.state.basemap].overlay.url }
                />
              </Overlay>
            </LayersControl>
          )
        }
      </div>
    )
  }
}

export default Basemap
