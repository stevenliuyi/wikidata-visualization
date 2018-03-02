import React, { Component } from 'react'
import Gallery from 'react-photo-gallery'
import Lightbox from 'react-images'
import OnImagesLoaded from 'react-on-images-loaded'
import Measure from 'react-measure'
import { getURL, getCommonsURL } from '../utils/commons'
import { getSingleTooltipHTML } from '../utils/convertData'
import Image from './Image'
import * as d3 from 'd3'
import Info from './Info'

class ImageGallery extends Component {
  state = {
    currentImage: 0,
    photos: [],
    lightbox_photos: [],
    imgInfo: [],
    width: -1
  }

  componentWillMount() {
    this.closeLightbox = this.closeLightbox.bind(this)
    this.openLightbox = this.openLightbox.bind(this)
    this.gotoNext = this.gotoNext.bind(this)
    this.gotoPrevious = this.gotoPrevious.bind(this)

    this.handleImagesLoaded = this.handleImagesLoaded.bind(this)

    this.getSources(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getSources(nextProps)
  }

  getSources(props) {
    d3.selectAll('.d3ToolTip').remove()
    var tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3ToolTip')

    const imageLabel = props.header[props.settings.image]
    const imgInfo = props.data
      .filter((item, i) => props.rowSelections.includes(i))
      .filter(item => item[imageLabel] != null)
      .map(item => ({
        src: getCommonsURL(item[imageLabel]),
        caption: item[props.header[props.settings.label]],
        showCaption: props.header[props.settings.label] != null,
        tooltip: tooltip,
        tooltipHTML: getSingleTooltipHTML(item, props.header)
      }))
      .slice(0, 100) // only load the first 100 images
    this.setState({ imgInfo })

    if (this.state.photos.length > 1) this.handleImagesLoaded(imgInfo, props)
  }

  handleImagesLoaded(info, props) {
    const imgInfo = info != null ? info : this.state.imgInfo
    let photos = [],
      lightbox_photos = []
    imgInfo.forEach((img, i) => {
      const imgElement = document.getElementById(`img${i}`)
      if (imgElement.naturalWidth > 0)
        photos.push({
          src: getURL(img.src, '320px'),
          width: imgElement.naturalWidth,
          height: imgElement.naturalHeight,
          caption: img.caption,
          showcaption: img.showCaption.toString(),
          tooltip: img.tooltip,
          tooltiphtml: img.tooltipHTML,
          effect: props.moreSettings.effect
        })
      if (imgElement.naturalWidth > 0)
        lightbox_photos.push({
          src: img.src,
          caption: img.caption
        })
    })
    this.setState({ photos, lightbox_photos })
  }

  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true
    })
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    })
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1
    })
  }

  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1
    })
  }

  render() {
    if (this.props.data.length === 0) {
      return <Info info="no-data" />
    } else if (this.props.rowSelections.length === 0) {
      return <Info info="no-selection" />
    }

    if (!this.props.dataTypes.includes('image')) return <Info info="no-image" />

    return (
      <div>
        <OnImagesLoaded
          onLoaded={info => this.handleImagesLoaded(info, this.props)}
        >
          {this.state.imgInfo.map((img, i) => (
            <img
              id={`img${i}`}
              key={`img${i}`}
              src={getURL(img.src, '10px')}
              alt=""
              style={{ display: 'none' }}
            />
          ))}
        </OnImagesLoaded>
        <Measure
          bounds
          onResize={contentRect =>
            this.setState({ width: contentRect.bounds.width })
          }
        >
          {({ measureRef }) => {
            if (this.state.width < 1) {
              return <div ref={measureRef} />
            }
            let columns = 1
            if (this.props.moreSettings.numOfColumns === 1) {
              // change number of columns dynamically
              if (this.state.width >= 384) {
                columns = 2
              }
              if (this.state.width >= 512) {
                columns = 3
              }
              if (this.state.width >= 768) {
                columns = 4
              }
            } else {
              columns = this.props.moreSettings.numOfColumns
            }

            return (
              <div ref={measureRef}>
                <Gallery
                  photos={this.state.photos}
                  columns={columns}
                  onClick={this.openLightbox}
                  ImageComponent={Image}
                />
              </div>
            )
          }}
        </Measure>
        <Lightbox
          images={this.state.lightbox_photos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
        />
      </div>
    )
  }
}

export default ImageGallery
