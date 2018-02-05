import React, { Component } from 'react'

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

    return (
      <div style={{ margin, width: photo.width, ...imgStyle }} className='galleryImage'>
        <img {...photo}
          alt=''
          onClick={(e) => onClick(e, { index, photo })}
          onMouseMove={(e) => {
            photo.tooltip
              .style('left', e.pageX + 10 + 'px')
              .style('top', e.pageY + 10 + 'px')
              .style('display', 'inline-block')
              .html(photo.tooltiphtml)
          }}
          onMouseOut={() => {
            photo.tooltip.style('display', 'none')
          }}
        />
        { photo.showcaption === 'true' &&
          <span style={{ maxWidth: photo.width, ...captionStyle }}>
            { (photo.caption != null) ? photo.caption : '　' }
          </span>
        }
      </div>
    )
  }
}

export default Image
