import React, { Component } from 'react'
import * as d3 from 'd3'
import { getColors } from '../utils/scales'
import { getTooltipHTML } from '../utils/convertData'
import { drawLegend } from '../utils/draw'
import { geoMercator } from 'd3-geo'
import { map2Settings, existRegionItems } from '../utils/maps2'
import Cartogram from 'cartogram-chart/dist/cartogram-chart.js'
import Info from './Info'

const getTopoJsonFileName = props =>
  process.env.NODE_ENV === 'development'
    ? `/maps/json/${map2Settings[props.moreSettings.map2].filename}`
    : `${process.env.PUBLIC_URL}/maps/json/${
        map2Settings[props.moreSettings.map2].filename
      }`

class CartogramMap extends Component {
  state = {
    chart: null
  }

  // initialize cartogram
  setD3Node = () => {
    d3.json(getTopoJsonFileName(this.props), (error, map) => {
      // prevent adding multiple maps
      if (document.getElementsByClassName('cartogram').length > 0) return

      if (error) throw error

      if (this.props.moreSettings.map2 === 'World') {
        map.objects.countries.geometries.splice(
          map.objects.countries.geometries.findIndex(
            d => d.properties.ISO_A2 === 'AQ'
          ),
          1
        )
      }

      const settings = map2Settings[this.props.moreSettings.map2]
      const myCartogram = Cartogram()

      map.objects[settings.objectname].geometries.forEach(geo => {
        geo.properties['label'] = geo.properties[settings.namekey]
        geo.properties['value'] = 1
        geo.properties['color'] = '#ECEFF1'
        geo.properties['tooltip'] = ''
      })

      myCartogram
        .width(this.props.width)
        .height(this.props.height)
        .topoJson(map)
        .topoObjectName(settings.objectname)
        .projection(
          geoMercator()
            .scale((this.props.width - 5) / (2 * Math.PI) * settings.scale)
            .translate([
              this.props.width * settings.translate[0],
              this.props.height * settings.translate[1]
            ])
        )
        .value(({ properties }) => properties.value)
        .color(({ properties }) => properties.color)
        .label(({ properties }) => properties.label)
        .tooltipContent(({ properties }) => properties.tooltip)
        .valFormatter(() => '')
        .iterations(1)(document.getElementById('chart'))

      this.setState({ chart: myCartogram })

      var zoomed = function() {
        d3
          .select('.cartogram')
          .selectAll('path')
          .attr('transform', d3.event.transform)
      }

      d3.select('.cartogram').call(
        d3
          .zoom()
          .scaleExtent([1 / 2, 12])
          .on('zoom', zoomed)
      )
    })
  }

  // update cartogram
  updateD3Node = props => {
    d3.json(getTopoJsonFileName(props), (error, map) => {
      if (error) throw error

      const settings = map2Settings[props.moreSettings.map2]
      if (props.settings.area === -1) {
        map.objects[settings.objectname].geometries.forEach(geo => {
          geo.properties['label'] = geo.properties[settings.namekey]
          geo.properties['value'] = 1
          geo.properties['color'] = '#ECEFF1'
          geo.properties['tooltip'] = ''
        })

        this.state.chart
          .width(props.width)
          .height(props.height)
          .topoJson(map)
          .topoObjectName(settings.objectname)
          .projection(
            geoMercator()
              .scale((props.width - 5) / (2 * Math.PI) * settings.scale)
              .translate([
                props.width * settings.translate[0],
                this.props.height * settings.translate[1]
              ])
          )
          .valFormatter(() => '')
          .iterations(1)

        return null
      }

      const areas = props.data.map(
        item => item[props.header[props.settings.area]]
      )
      const items = props.data.map(
        item => item[props.header[props.settings.region]]
      )
      const colors = getColors(props)
      const tooltipHTMLs = getTooltipHTML(props)

      let new_geometries = []
      map.objects[settings.objectname].geometries.forEach(geo => {
        if (items.includes(settings.names[geo.properties[settings.namekey]])) {
          const regionItem = settings.names[geo.properties[settings.namekey]]
          const regionIndex = items.indexOf(regionItem)

          geo.properties['value'] = areas[regionIndex]
          geo.properties['color'] = colors[regionIndex]
          geo.properties['label'] = geo.properties[settings.namekey]
          geo.properties['tooltip'] = tooltipHTMLs[regionIndex]

          new_geometries.push(geo)
        }
      })

      map.objects[settings.objectname].geometries = new_geometries

      this.state.chart
        .width(props.width)
        .height(props.height)
        .topoJson(map)
        .topoObjectName(settings.objectname)
        .projection(
          geoMercator()
            .scale((props.width - 5) / (2 * Math.PI) * settings.scale)
            .translate([
              props.width * settings.translate[0],
              props.height * settings.translate[1]
            ])
        )
        .valFormatter(d3.format('.3e'))
        .iterations(props.moreSettings.iterations)
    })
  }

  componentWillMount() {
    this.setD3Node.bind(this)
  }

  componentDidUpdate() {
    if (document.getElementById('chart') != null) {
      if (this.state.chart == null) {
        this.setD3Node()
      } else {
        this.updateD3Node(this.props)
      }
    } else {
      if (this.state.chart != null) this.setState({ chart: null })
    }

    // show legend
    const colorScale = getColors(this.props, true)[1]
    d3.selectAll('.legendCells').remove()
    var svg = d3.select('.cartogram')
    drawLegend(svg, colorScale, this.props)
  }

  render() {
    if (!this.props.dataTypes.includes('number'))
      return <Info info="no-number" text="cartogram map" />
    if (!existRegionItems(this.props))
      return (
        <Info
          info="no-region"
          text={this.props.moreSettings.map2}
          showSettings={true}
        />
      )

    return (
      <div
        id="chart"
        style={{ height: this.props.height, width: this.props.width }}
        dangerouslySetInnerHTML={{ __html: '' }}
      />
    )
  }
}

export default CartogramMap
