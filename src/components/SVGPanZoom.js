import React, { Component } from 'react'
import { ReactSVGPanZoom, TOOL_AUTO } from 'react-svg-pan-zoom'

class SVGPanZoom extends Component {

  render() {
    return (
      <ReactSVGPanZoom
        width={this.props.width}
        height={this.props.height}
        tool={TOOL_AUTO}
        background='white'
        toolbarPosition='none'
        miniaturePosition='none'
        detectAutoPan={false}>
        { this.props.d3node }
      </ReactSVGPanZoom>
    )
  }
}

export default SVGPanZoom
