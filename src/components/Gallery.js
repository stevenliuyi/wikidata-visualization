import React, { Component } from 'react'
import Gallery from 'react-photo-gallery'
import Lightbox from 'react-images'
import OnImagesLoaded from 'react-on-images-loaded'
import Measure from 'react-measure'

class ImageGallery extends Component {
  state = {
    currentImage: 0,
    photos: [],
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
    const imageLabel = props.header[props.settings.image]
    const imgInfo = props.data.filter((item, i) => props.rowSelections.includes(i))
      .filter(item => item[imageLabel] != null)
      .map(item => ({
        src: item[imageLabel],
        caption: item[props.header[props.settings.label]]
      }))
      .slice(0, 100) // only load the first 100 images
    this.setState({ imgInfo })

    if (this.state.photos.length > 1) this.handleImagesLoaded(imgInfo)
  }

  handleImagesLoaded(info) {
    const imgInfo = (info != null) ? info : this.state.imgInfo
    let photos = []
    imgInfo.forEach((img, i) => {
      const imgElement = document.getElementById(`img${i}`)
      if (imgElement.naturalWidth > 0) photos.push({
        src: img.src,
        width: imgElement.naturalWidth,
        height: imgElement.naturalHeight,
        caption:img.caption
      })
    })
    this.setState({ photos })
  }

  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true,
    })
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    })
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    })
  }

  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    })
  }

  render() {
    
    return (
      <div>
        <OnImagesLoaded
          onLoaded={this.handleImagesLoaded}
        >
          {
            this.state.imgInfo.map((img, i) => (
              <img id={`img${i}`} src={img.src} alt='' style={{display: 'none'}} />
            ))
          }      
        </OnImagesLoaded>
        <Measure
          bounds
          onResize={(contentRect) => this.setState({ width: contentRect.bounds.width })}>
          { // change number of columns dynamically
            ({ measureRef }) => {
              if (this.state.width < 1) {
                return <div ref={measureRef}></div>
              }
              let columns = 1
              if (this.state.width >= 384) {
                columns = 2
              }
              if (this.state.width >= 512) {
                columns = 3
              }
              if (this.state.width >= 768) {
                columns = 4
              }
              return <div ref={measureRef}><Gallery photos={this.state.photos} columns={columns} onClick={this.openLightbox} /></div>
            }
          }
        </Measure>
        <Lightbox images={this.state.photos}
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
