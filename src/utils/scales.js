import * as d3 from 'd3'
import { interpolateSpectral } from 'd3-scale-chromatic'

export function getXYScales(props)  {
  const xLabel = props.header[props.settings['x-axis']]
  const yLabel = props.header[props.settings['y-axis']]
  const xMin = d3.min(props.data, d => d[xLabel])
  const yMin = d3.min(props.data, d => d[yLabel])
  const xMax = d3.max(props.data, d => d[xLabel])
  const yMax = d3.max(props.data, d => d[yLabel])
  
  const xScale = d3.scaleLinear()
    .domain([xMin, xMax])
    .range([props.padding, props.width-props.padding*2])
  
  const yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([props.height-props.padding, props.padding])

  return [{ xScale, yScale }, xLabel, yLabel]
}

export function getRadiusScale(props) {
  const minRadius = 3
  const maxRadius = 30

  // single radius by default
  let radiusScale = (v) => minRadius

  if (props.settings['radius'] !== -1) {
    const label = props.header[props.settings['radius']]
    const minValue = d3.min(props.data, d => d[label])
    const maxValue = d3.max(props.data, d => d[label])
    radiusScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([minRadius,maxRadius])
  }

  return radiusScale
}

export function getRadius(props) {
  const label = props.header[props.settings['radius']]
  const radiusScale = getRadiusScale(props)
  const radii = props.data.map(item => radiusScale(item[label]))

  return radii
}

export function getColorScaleFromValues(values) {
  // generate uniformly distributed points in [0, 1] and map to color scheme
  const scheme = [...Array(values.length).keys()]
    .map( v => interpolateSpectral(v / (values.length-1)) )
  const colorScale = (v) => scheme[values.indexOf(v)]
  return colorScale
}

export function getColorScale(props) {
  // single color by default
  let colorScale = (v) => interpolateSpectral(0.8)

  if (props.settings['color'] !== -1) {
    const label = props.header[props.settings['color']]
    // numeric values
    if (typeof(props.data[0][label]) === 'number') {
      const minValue = d3.min(props.data, d => d[label])
      const maxValue = d3.max(props.data, d => d[label])
      colorScale = (v) => interpolateSpectral((v-minValue)/(maxValue-minValue))
    } else { // non-numeric values
      const values = props.data.map(item => item[label])
      const unique_values = [...new Set(values)].sort()
      colorScale = getColorScaleFromValues(unique_values)
    }
  }
  return colorScale
}

export function getColors(props) {
  const label = props.header[props.settings['color']]
  const colorScale = getColorScale(props)
  const colors = props.data.map(item => colorScale(item[label]))
  
  return colors
}
