import React, { Component } from 'react'
import WordCloud from 'react-d3-cloud'
import { getWordCloudData } from '../utils/convertData'

class Cloud extends Component {

  render() {
    const [data, colors] = getWordCloudData(this.props)
    const rotate = (word) => {
      const maxRotation = this.props.moreSettings.rotation
      const minRotation = -maxRotation
      return Math.random() * (maxRotation - minRotation) + minRotation
    }

    return (
      <div id='chart'>
        <WordCloud
          data={data}
          width={this.props.width}
          height={this.props.height}
          fontSizeMapper={word=>word.fontSize}
          rotate={rotate}
          font='sans-serif'
          colors={colors} // colors are supported through a patch
        />
      </div>
    )
  }
}

export default Cloud
