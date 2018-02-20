import { Path } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-arc'
import arc from 'arc'

/**
 * transform l.latlng to {x, y} object
 * @param {l.latlng} latlng
 * @returns {{x: {number}, y: {number}}}
 * @private
 */
const _latLngToXY = latlng => ({
  x: latlng.lng,
  y: latlng.lat
})

/**
 * Create array of L.LatLng objects from line produced by arc.js
 * @param {object} line
 * @param {L.LatLng} from
 * @private
 * @returns {Array}
 */
function _createLatLngs(line, from) {
  if (line.geometries[0] && line.geometries[0].coords[0]) {
    /**
     * stores how many times arc is broken over 180 longitude
     * @type {number}
     */
    let wrap = from.lng - line.geometries[0].coords[0][0] - 360

    return line.geometries
      .map(subLine => {
        wrap += 360
        return subLine.coords.map(point =>
          L.latLng([point[1], point[0] + wrap])
        )
      })
      .reduce((all, latlngs) => all.concat(latlngs))
  } else {
    return []
  }
}

export default class Arc extends Path {
  createLeafletElement(props) {
    const { position, options } = props
    return L.Polyline.Arc(position.from, position.to, options)
  }

  updateLeafletElement(fromProps, toProps) {
    const { position, options } = toProps

    if (
      position.from[0] !== fromProps.position.from[0] ||
      position.from[1] !== fromProps.position.from[1] ||
      position.to[0] !== fromProps.position.to[0] ||
      position.to[1] !== fromProps.position.to[1]
    ) {
      const generator = new arc.GreatCircle(
        _latLngToXY(L.latLng(position.from)),
        _latLngToXY(L.latLng(position.to))
      )
      const arcLine = generator.Arc(options.vertices, {
        offset: options.offset
      })
      const latLngs = _createLatLngs(arcLine, position.from)
      this.leafletElement.setLatLngs(latLngs)
    }

    if (options.weight !== fromProps.options.weight) {
      this.leafletElement.setStyle({ weight: options.weight })
    }
  }
}
