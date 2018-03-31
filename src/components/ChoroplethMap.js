import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  ZoomableGlobe,
  Geographies,
  Geography
} from 'react-simple-maps'
import { Button, ButtonGroup } from 'react-bootstrap'
import { getColors } from '../utils/scales'
import { map2Settings } from '../utils/maps2'
import { getTooltipHTML } from '../utils/convertData'
import { drawLegend, drawTooltip, updateTooltip } from '../utils/draw'
import chroma from 'chroma-js'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import * as d3 from 'd3'
import Info from './Info'
import { existRegionItems } from '../utils/maps2'

const wrapperStyles = {
  width: '100%',
  margin: '0 auto',
  marginBottom: '-5px' // make the border consistent with other charts
}

class ChoroplethMap extends Component {
  state = {
    center: [0, 20],
    zoom: 1,
    baseZoom: 1,
    colors: [],
    colorScale: null,
    tooltipHTMLs: []
  }

  componentWillMount() {
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ center: map2Settings[nextProps.moreSettings.map2].center })
    this.setState({
      zoom: Math.min(nextProps.width / 980, nextProps.height / 551),
      baseZoom: Math.min(nextProps.width / 980, nextProps.height / 551)
    })
    const [colors, colorScale] = getColors(nextProps, true)
    const tooltipHTMLs = getTooltipHTML(nextProps)
    this.setState({ colors, colorScale, tooltipHTMLs })

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

    if (d3.event != null) return // zooming

    var svg = d3.select('.rsm-svg')

    // show legend
    if (this.state.colorScale != null) {
      d3.selectAll('.legendCells').remove()
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
    if (!existRegionItems(this.props))
      return (
        <Info
          info="no-region"
          text={this.props.moreSettings.map2}
          showSettings={true}
        />
      )

    d3.selectAll('.d3ToolTip').remove()
    var tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3ToolTip')

    const settings = map2Settings[this.props.moreSettings.map2]
    const items = this.props.data.map(
      item => item[this.props.header[this.props.settings.region]]
    )

    const json_filename =
      process.env.NODE_ENV === 'development'
        ? `/maps/json/${settings.filename}`
        : `${process.env.PUBLIC_URL}/maps/json/${settings.filename}`

    const Zoomable =
      this.props.moreSettings.projection !== 'orthographic'
        ? ZoomableGroup
        : ZoomableGlobe

    return (
      <div id="chart" style={wrapperStyles}>
        <ComposableMap
          projection={this.props.moreSettings.projection}
          projectionConfig={{
            scale: settings.scale0,
            rotation: settings.rotation
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
          >
            <Geographies geography={json_filename} disableOptimization>
              {(geographies, projection) =>
                geographies.map((geography, i) => {
                  let color = this.state.colors[
                    items.indexOf(
                      settings.names[geography.properties[settings.namekey]]
                    )
                  ]
                  color = color != null ? color : '#ddd'
                  const tooltipHTML = this.state.tooltipHTMLs[
                    items.indexOf(
                      settings.names[geography.properties[settings.namekey]]
                    )
                  ]
                  return geography.properties.CONTINENT !== 'Antarctica' ? (
                    <Geography
                      key={i}
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: color,
                          stroke: '#607D8B',
                          strokeWidth: 0.75,
                          outline: 'none'
                        },
                        hover: {
                          fill: chroma(color).darken(0.5),
                          stroke: '#607D8B',
                          strokeWidth: 0.75,
                          outline: 'none'
                        },
                        pressed: {
                          fill: chroma(color).brighten(0.5),
                          stroke: '#607D8B',
                          strokeWidth: 0.75,
                          outline: 'none'
                        }
                      }}
                      onMouseEnter={(feature, e) => {
                        drawTooltip(tooltipHTML, e)
                      }}
                      onMouseMove={(feature, e) => {
                        // fix the issue that onMouseEnter of next object is trigged before onMouseLeave of current object
                        if (
                          tooltipHTML != null &&
                          tooltip.style('display') === 'none'
                        )
                          tooltip.style('display', 'inline-block')
                        updateTooltip(e)
                      }}
                      onMouseLeave={() => {
                        tooltip.style('display', 'none')
                      }}
                    />
                  ) : null
                })
              }
            </Geographies>
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

export default ChoroplethMap
