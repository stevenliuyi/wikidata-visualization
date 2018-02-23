import React, { Component } from 'react'
import * as d3 from 'd3'
import { drawTooltip, updateTooltip } from '../utils/draw'

const imgStyle = {
  cursor: 'pointer',
  overflow: 'hidden',
  float: 'left',
  position: 'relative'
}

const captionStyle = {
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: '#aaa'
}

class Image extends Component {
  render() {
    const { index, onClick, photo, margin } = this.props

    const filter =
      photo.effect !== 'no effect' ? `${photo.effect}(100%)` : 'none'

    return (
      <div
        style={{ margin, width: photo.width, ...imgStyle }}
        className="galleryImage"
      >
        <img
          {...photo}
          alt=""
          style={{
            filter: filter,
            WebkitFilter: filter
          }}
          onClick={e => onClick(e, { index, photo })}
          onMouseOver={e => {
            drawTooltip(photo.tooltiphtml, e)

            d3
              .select(e.target)
              .style(
                '-webkit-filter',
                `${filter !== 'none' ? filter : ''} brightness(120%)`
              )
              .style(
                'filter',
                `${filter !== 'none' ? filter : ''} brightness(120%)`
              )
          }}
          onMouseMove={e => {
            updateTooltip(e)
          }}
          onMouseOut={e => {
            photo.tooltip.style('display', 'none')
            d3
              .select(e.target)
              .style('-webkit-filter', filter)
              .style('filter', filter)
          }}
        />
        {photo.showcaption === 'true' && (
          <span style={{ maxWidth: photo.width, ...captionStyle }}>
            {photo.caption != null ? photo.caption : '　'}
          </span>
        )}
      </div>
    )
  }
}

export default Image
