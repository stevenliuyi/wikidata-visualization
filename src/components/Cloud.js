import React, { Component } from 'react'
import WordCloud from 'react-d3-cloud'
import { getWordCloudData } from '../utils/convertData'

class Cloud extends Component {
  state = {
    segmenter: null
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.moreSettings.delimiter !== nextProps.moreSettings.delimiter
    ) {
      if (nextProps.moreSettings.delimiter === 'Chinese') {
        import('segmentit').then(module => {
          const segmenter = module.useDefault(new module.default())
          this.setState({ segmenter })
        })
      } else if (nextProps.moreSettings.delimiter === 'Japanese') {
        import('tiny-segmenter').then(TinySegmenter => {
          const segmenter = new TinySegmenter()
          this.setState({ segmenter })
        })
      }
    }
  }

  render() {
    const [data, colors] = getWordCloudData(this.props, this.state.segmenter)
    const rotate = word => {
      const maxRotation = this.props.moreSettings.rotation
      const minRotation = -maxRotation
      return Math.random() * (maxRotation - minRotation) + minRotation
    }

    return (
      <div id="chart">
        <WordCloud
          data={data}
          width={this.props.width}
          height={this.props.height}
          fontSizeMapper={word => word.fontSize}
          rotate={rotate}
          font="Source Sans Pro"
          colors={colors} // colors are supported through a patch
        />
      </div>
    )
  }
}

export default Cloud
