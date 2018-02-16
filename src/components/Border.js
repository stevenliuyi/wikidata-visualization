import React, { Component } from 'react'

class Border extends Component {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          width: this.props.width,
          height: this.props.height,
          minWidth: this.props.width,
          minHeight: this.props.height,
          border: '1px solid #ddd',
          zIndex: 500,
          pointerEvents: 'none'
        }}
      />
    )
  }
}

export default Border
