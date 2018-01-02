import React, { Component } from 'react'
import * as d3 from 'd3'
import { getColors } from '../utils/scales'
import { geoMercator } from 'd3-geo'
import { countryNames } from '../utils/mapNames'
import Cartogram from 'cartogram-chart/dist/cartogram-chart.min.js'

const getTopoJsonFileName = () => (
  (process.env.NODE_ENV === 'development')
    ? '/maps/world-110m.json'
    : '/wikidata-visualization/maps/world-110m.json'
)

class CartogramMap extends Component {

  state = {
    chart: null 
  }

  // initialize cartogram
  setD3Node = () => {

    d3.selectAll('.cartogram-tooltip').html('')

    d3.json(getTopoJsonFileName(), (error, map) => {
      if (error) throw error

      map.objects.countries.geometries.splice(
        map.objects.countries.geometries.findIndex(d=>d.properties.ISO_A2 === 'AQ'),
        1
      )

      const myCartogram = Cartogram()

      myCartogram
        .width(this.props.width)
        .height(this.props.height)
        .topoJson(map)
        .projection(geoMercator()
          .scale((this.props.width-5)/(2*Math.PI))
          .translate([this.props.width/2, this.props.height/1.6]))
        .color(() => '#999')
        .label(({ properties }) => properties.NAME)
        .valFormatter(() => '')
        .iterations(0)(document.getElementById('chart'))
     
      this.setState({ chart: myCartogram })

      var zoomed = function() {
        d3.select('.cartogram')
          .selectAll('path')
          .attr('transform', d3.event.transform)
      }

      d3.select('.cartogram').call(d3.zoom()
        .scaleExtent([1/2,12])
        .on('zoom', zoomed))

    })
  } 

  // update cartogram
  updateD3Node = (props) => {
    if (props.settings.area === -1) return null

    d3.json(getTopoJsonFileName(), (error, map) => {
      if (error) throw error
    
      const areas = props.data.map(item => item[props.header[props.settings.area]])
      const items = props.data.map(item => item[props.header[props.settings.region]])
      const colors = getColors(props)

      let new_geometries = []
      map.objects.countries.geometries.forEach( geo => {
        if (items.includes(countryNames[geo.properties.ISO_A3])) new_geometries.push(geo)
      })

      map.objects.countries.geometries = new_geometries

      this.state.chart
        .width(props.width)
        .height(props.height)
        .topoJson(map)
        .projection(geoMercator()
          .scale((props.width-5)/(2*Math.PI))
          .translate([props.width/2, props.height/1.6]))
        .value(({ properties }) => {
          const countryItem = countryNames[properties.ISO_A3]
          const countryIndex = items.indexOf(countryItem)
          return areas[countryIndex]
        })
        .color(({ properties }) => {
          const countryItem = countryNames[properties.ISO_A3]
          const countryIndex = items.indexOf(countryItem)
          return colors[countryIndex]
        })
        .iterations(20)

    })
  }
  
  componentWillMount() {
    this.setD3Node.bind(this)
  }

  componentDidMount() {
    this.setD3Node()
  }

  shouldComponentUpdate(nextProps) {
    if (this.state.chart !== null) this.updateD3Node(nextProps)
    return false
  }

  render() {
    return (
      <div id='chart' style={{height: this.props.height, width: this.props.width}}
        dangerouslySetInnerHTML={{__html: ''}} />
    )
  }
}

export default CartogramMap
