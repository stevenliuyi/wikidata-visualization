import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps'
import { Button, ButtonGroup } from 'react-bootstrap'
import { getColors } from '../utils/scales'
import { map2Settings } from '../utils/maps2'
import { getTooltipHTML } from '../utils/convertData'
import chroma from 'chroma-js'
import * as d3 from 'd3'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'

const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
}

class ChoroplethMap extends Component {
  state = {
    center: [0, 20],
    zoom: 1,
    colors: [],
    tooltipHTMLs: []
  }

  componentWillMount() {
    this.handleZoomIn = this.handleZoomIn.bind(this)
    this.handleZoomOut = this.handleZoomOut.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ center: map2Settings[nextProps.moreSettings.map2].center })
    this.setState({ center: [100,90]})
    this.setState({ center: map2Settings[nextProps.moreSettings.map2].center })
    const colors = getColors(nextProps)
    const tooltipHTMLs = getTooltipHTML(nextProps)
    this.setState({ colors, tooltipHTMLs })
  }

  handleZoomIn() {
    this.setState({ zoom: this.state.zoom * 2})
  }

  handleZoomOut() {
    this.setState({ zoom: this.state.zoom / 2})
  }

  render() {

    d3.selectAll('.d3ToolTip').remove()
    var tooltip = d3.select('body').append('div').attr('class', 'd3ToolTip')

    const settings = map2Settings[this.props.moreSettings.map2]
    const items = this.props.data.map(item => item[this.props.header[this.props.settings.region]])

    const json_filename = (process.env.NODE_ENV === 'development')
      ? `/maps/${settings.filename}`
      : `/wikidata-visualization/maps/${settings.filename}`

    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection={this.props.moreSettings.projection}
          projectionConfig={{
            scale: settings.scale0,
            rotation: settings.rotation
          }}
          width={980}
          height={551}
          style={{
            width: '100%',
            height: this.props.canvasSettings.height < 0
              ? 'auto' : this.props.canvasSettings.height,
          }}
        >
          <ZoomableGroup center={this.state.center} zoom={this.state.zoom}>
            <Geographies
              geography={json_filename}
              disableOptimization
            >
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                {
                  let color = this.state.colors[items.indexOf(settings.names[geography.properties[settings.namekey]])]
                  color = (color != null) ? color : '#ddd'
                  const tooltipHTML = this.state.tooltipHTMLs[items.indexOf(settings.names[geography.properties[settings.namekey]])]
                  return <Geography
                    key={i}
                    geography={geography}
                    projection={projection}
                    style={{
                      default: {
                        fill: color,
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                      hover: {
                        fill: chroma(color).darken(0.5),
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                      pressed: {
                        fill: chroma(color).brighten(0.5),
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                    }}
                    onMouseMove={(feature,e) => {
                      if (tooltipHTML != null) {
                        tooltip
                          .style('left', e.pageX - 10 + 'px')
                          .style('top', e.pageY - 10 + 'px')
                          .style('display', 'inline-block')
                          .html(tooltipHTML)
                      } 
                    }}
                    onMouseLeave={() => {
                      tooltip.style('display', 'none')
                    }}
                  />
                })}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <ButtonGroup className='zoom-button'>
          <Button onClick={this.handleZoomOut}><FaMinus size={12} /></Button>
          <Button onClick={this.handleZoomIn}><FaPlus size={12} /></Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default ChoroplethMap
