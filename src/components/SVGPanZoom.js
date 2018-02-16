import React, { Component } from 'react'
import { ReactSVGPanZoom, TOOL_AUTO } from 'react-svg-pan-zoom'

class SVGPanZoom extends Component {
  componentDidUpdate() {
    if (this.viewer !== this.props.viewer)
      this.props.onViewerChange(this.viewer)
  }

  render() {
    return (
      <ReactSVGPanZoom
        ref={viewer => (this.viewer = viewer)}
        width={this.props.width}
        height={this.props.height}
        tool={TOOL_AUTO}
        background="white"
        toolbarPosition="none"
        miniaturePosition="none"
        detectAutoPan={false}
      >
        <svg width={this.props.width} height={this.props.height}>
          {this.props.children}
        </svg>
      </ReactSVGPanZoom>
    )
  }
}

export default SVGPanZoom
