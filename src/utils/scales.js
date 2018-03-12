import * as d3 from 'd3'
import * as d3color from 'd3-scale-chromatic'
import { formatBCDates } from '../utils/format'

export function getXYScales(props) {
  const xLabel = props.header[props.settings['x-axis']]
  const yLabel = props.header[props.settings['y-axis']]

  const selectedData = props.data.filter((item, i) =>
    props.rowSelections.includes(i)
  )

  let xMin, xMax, xScale, yMin, yMax, yScale

  if (props.dataTypes[props.settings['x-axis']] === 'number') {
    xMin = d3.min(selectedData, d => d[xLabel])
    xMax = d3.max(selectedData, d => d[xLabel])
    xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([props.padding, props.width - props.padding * 2])
  } else {
    // time
    xMin = d3.min(
      selectedData,
      d => new Date(Date.parse(formatBCDates(d[xLabel])))
    )
    xMax = d3.max(
      selectedData,
      d => new Date(Date.parse(formatBCDates(d[xLabel])))
    )
    xScale = d3
      .scaleTime()
      .domain([xMin, xMax])
      .range([props.padding, props.width - props.padding * 2])
  }

  if (props.dataTypes[props.settings['y-axis']] === 'number') {
    yMin = d3.min(selectedData, d => d[yLabel])
    yMax = d3.max(selectedData, d => d[yLabel])
    yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([props.height - props.padding, props.padding])
  } else {
    // time
    yMin = d3.min(
      selectedData,
      d => new Date(Date.parse(formatBCDates(d[yLabel])))
    )
    yMax = d3.max(
      selectedData,
      d => new Date(Date.parse(formatBCDates(d[yLabel])))
    )
    yScale = d3
      .scaleTime()
      .domain([yMin, yMax])
      .range([props.height - props.padding, props.padding])
  }

  return [{ xScale, yScale }, xLabel, yLabel]
}

export function getRadiusScale(props, minRadius = 3, maxRadius = 30) {
  ;[minRadius, maxRadius] = props.moreSettings.radius
  // single radius by default
  let radiusScale = v => minRadius

  if (props.settings['radius'] !== -1) {
    const label = props.header[props.settings['radius']]
    const selectedData = props.data.filter((item, i) =>
      props.rowSelections.includes(i)
    )
    if (props.dataTypes[props.settings['radius']] === 'number') {
      const minValue = d3.min(selectedData, d => d[label])
      const maxValue = d3.max(selectedData, d => d[label])
      radiusScale = d3
        .scaleLinear()
        .domain([minValue, maxValue])
        .range([minRadius, maxRadius])
    } else {
      // time
      const minValue = d3.min(
        selectedData,
        d => new Date(Date.parse(formatBCDates(d[label])))
      )
      const maxValue = d3.max(
        selectedData,
        d => new Date(Date.parse(formatBCDates(d[label])))
      )
      radiusScale = d3
        .scaleTime()
        .domain([minValue, maxValue])
        .range([minRadius, maxRadius])
    }
  }

  return radiusScale
}

export function getRadius(props, minRadius = 3, maxRadius = 30) {
  const label = props.header[props.settings['radius']]
  const radiusScale = getRadiusScale(props, minRadius, maxRadius)
  const parseData =
    props.dataTypes[props.settings['radius']] === 'number'
      ? parseFloat
      : d => new Date(d)
  const radii = props.data
    .filter((item, i) => props.rowSelections.includes(i))
    .map(item => radiusScale(parseData(item[label])).toString())

  return radii
}

export const colorSchemeNames = [
  'Brown / White / Blue-Green',
  'Purple / White / Green',
  'Pink / White / Yellow-Green',
  'Purple / White / Orange',
  'Red / White / Blue',
  'Red / White / Grey',
  'Red / Yellow / Blue',
  'Red / Yellow / Green',
  'Spectral',
  'Blues',
  'Greens',
  'Greys',
  'Oranges',
  'Purples',
  'Reds',
  'White / Blue / Green',
  'White / Blue / Purple',
  'White / Green / Blue',
  'White / Orange / Red',
  'White / Purple / Blue / Green',
  'White / Purple / Blue',
  'White / Purple / Red',
  'White / Red / Purple',
  'White / Yellow / Green / Blue',
  'White / Yellow / Green',
  'White / Yellow / Orange / Brown',
  'White / Yellow / Orange / Red'
]

export const colorSchemes = {
  'Brown / White / Blue-Green': d3color.interpolateBrBG,
  'Purple / White / Green': d3color.interpolatePRGn,
  'Pink / White / Yellow-Green': d3color.interpolatePiYG,
  'Purple / White / Orange': d3color.interpolatePuOr,
  'Red / White / Blue': d3color.interpolateRdBu,
  'Red / White / Grey': d3color.interpolateRdGy,
  'Red / Yellow / Blue': d3color.interpolateRdYlBu,
  'Red / Yellow / Green': d3color.interpolateRdYlGn,
  Spectral: d3color.interpolateSpectral,
  Blues: d3color.interpolateBlues,
  Greens: d3color.interpolateGreens,
  Greys: d3color.interpolateGreys,
  Oranges: d3color.interpolateOranges,
  Purples: d3color.interpolatePurples,
  Reds: d3color.interpolateReds,
  'White / Blue / Green': d3color.interpolateBuGn,
  'White / Blue / Purple': d3color.interpolateBuPu,
  'White / Green / Blue': d3color.interpolateGnBu,
  'White / Orange / Red': d3color.interpolateOrRd,
  'White / Purple / Blue / Green': d3color.interpolatePuBuGn,
  'White / Purple / Blue': d3color.interpolatePuBu,
  'White / Purple / Red': d3color.interpolatePuRd,
  'White / Red / Purple': d3color.interpolateRdPu,
  'White / Yellow / Green / Blue': d3color.interpolateYlGnBu,
  'White / Yellow / Green': d3color.interpolateYlGn,
  'White / Yellow / Orange / Brown': d3color.interpolateYlOrBr,
  'White / Yellow / Orange / Red': d3color.interpolateYlOrRd
}

export function getColorScaleFromValues(values, schemeName = 'Spectral') {
  // scale to avoid colors near two ends of scheme when number of values is small
  const scale = values.length <= 5 ? 0.7 : 1

  // generate uniformly distributed points in [0, 1] (and scale) and map to color scheme
  const scheme = [...Array(values.length).keys()].map(v => {
    let val = v / (values.length - 1)
    val = val * scale + (1 - scale) * 0.5
    return colorSchemes[schemeName](val)
  })

  const colorScale =
    values.length > 1
      ? d3
          .scaleOrdinal()
          .domain(values)
          .range(values.map((v, i) => scheme[i]))
      : d3
          .scaleOrdinal()
          .domain(values)
          .range([colorSchemes[schemeName](0.8)])

  return colorScale
}

export function getColorScale(props, nodes = null) {
  // single color by default
  let colorScale = v => colorSchemes[schemeName](0.8)
  const schemeName = props.moreSettings.color

  // when nodes from a graph are present, values are extracted from node['color'] instead of the original data
  if (
    (props.settings['color'] !== -1 && nodes == null) ||
    (nodes != null && nodes[0]['color'] != null)
  ) {
    const label = props.header[props.settings['color']]
    const selectedData =
      nodes == null
        ? props.data.filter((item, i) => props.rowSelections.includes(i))
        : nodes

    // numeric values
    if (
      (props.dataTypes[props.settings['color']] === 'number' &&
        nodes == null) ||
      (nodes != null && typeof nodes[0]['color'] === 'number')
    ) {
      const minValue = d3.min(
        selectedData,
        d => (nodes == null ? d[label] : d['color'])
      )
      const maxValue = d3.max(
        selectedData,
        d => (nodes == null ? d[label] : d['color'])
      )
      colorScale = d3
        .scaleSequential(colorSchemes[schemeName])
        .domain([minValue, maxValue])
    } else if (
      (props.dataTypes[props.settings['color']] === 'time' && nodes == null) ||
      (nodes != null &&
        new Date(nodes[0]['color']) !== 'Invalid Date' &&
        !isNaN(new Date(nodes[0]['color'])))
    ) {
      // time values
      const minValue = d3.min(
        selectedData,
        d =>
          new Date(
            Date.parse(formatBCDates(nodes == null ? d[label] : d['color']))
          )
      )
      const maxValue = d3.max(
        selectedData,
        d =>
          new Date(
            Date.parse(formatBCDates(nodes == null ? d[label] : d['color']))
          )
      )
      colorScale = d3
        .scaleSequential(colorSchemes[schemeName])
        .domain([minValue, maxValue])
    } else {
      // non-numeric values
      const values =
        nodes == null
          ? selectedData.map(item => item[label])
          : selectedData.map(item => item['color'])
      const unique_values = [...new Set(values)].sort()
      const colorScaleFromValues = getColorScaleFromValues(
        unique_values,
        schemeName
      )
      colorScale =
        unique_values.length !== 1
          ? d3
              .scaleOrdinal()
              .domain(unique_values)
              .range(unique_values.map(v => colorScaleFromValues(v)))
          : d3
              .scaleLinear()
              .domain(unique_values)
              .range([colorSchemes[schemeName](0.8)]) // only one unique value
    }
  }
  return colorScale
}

export function getColors(props, returnScale = false) {
  const label = props.header[props.settings['color']]
  const colorScale = getColorScale(props)
  // change the color of unkown values (default is black)
  const colors = props.data
    .filter((item, i) => props.rowSelections.includes(i))
    .map(
      item =>
        item[label] != null || props.settings['color'] === -1
          ? colorScale(
              props.dataTypes[props.settings['color']] === 'time'
                ? Date.parse(formatBCDates(item[label]))
                : item[label]
            )
          : '#eceff1'
    )

  if (returnScale) {
    return [colors, colorScale]
  } else {
    return colors
  }
}
