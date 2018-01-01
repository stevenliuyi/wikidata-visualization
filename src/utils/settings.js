// chart settings
import { getDataTypeIndices } from './convertData'

const x_axis = {
  value: 'x-axis',
  title: 'X-axis',
  type: 'number'
}

const y_axis = {
  value: 'y-axis',
  title: 'Y-axis',
  type: 'number'
}

const label = {
  value: 'label',
  title: 'Label',
  type: 'all'
}

const color = {
  value: 'color',
  title: 'Color',
  type: 'all'
}

const radius = {
  value: 'radius',
  title: 'Radius',
  type: 'number'
}

const link_from = {
  value: 'link-from',
  title: 'Link from',
  type: 'item'
}

const link_to = {
  value: 'link-to',
  title: 'Link to',
  type: 'item'
}

const relation = {
  value: 'relation',
  title: 'Relation',
  type: 'number'
}

const coordinate = {
  value: 'coordinate',
  title: 'Coordinate',
  type: 'coordinate'
}

export const moreSettings = {
  fontSize: 10,
  radius: [5, 40],
  color: 'Spectral',
  map: 'World',
  projection: 'mercator'
}

export const moreSettingTitles = {
  fontSize: 'Font size',
  radius: 'Radius',
  color: 'Colors',
  map: 'Region',
  projection: 'Map projection'
}

// chart classes
export const chartClasses = [
  {
    chartClass: 'basic',
    name: 'Basic'
  },
  {
    chartClass: 'tree',
    name: 'Trees'
  },
  {
    chartClass: 'map',
    name: 'Maps'
  },
  {
    chartClass: 'more',
    name: 'More'
  }
]

// information object of all chart types
export const charts = [
  { 
    id: 1.01,
    name: 'Table'
  },
  {
    id: 1.02,
    name: 'Scatter Chart',
    chartClass: 'basic',
    settings: [x_axis, y_axis, label, color, radius],
    defaultShow: [true, true, false, false, false],
    moreSettings: ['fontSize', 'radius', 'color']
  },
  {
    id: 1.03,
    name: 'Bubble Chart',
    chartClass: 'basic',
    settings: [radius, label, color],
    defaultShow: [true, true, false],
    moreSettings: ['fontSize', 'color']
  },
  {
    id: 1.04,
    name: 'Radial Tree',
    chartClass: 'tree',
    settings: [link_from, link_to, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color']
  },
  {
    id: 1.05,
    name: 'Radial Cluster',
    chartClass: 'tree',
    settings: [link_from, link_to, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color']
  },
  {
    id: 1.06,
    name: 'Tree',
    chartClass: 'tree',
    settings: [link_from, link_to, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color']
  },
  {
    id: 1.07,
    name: 'Cluster',
    chartClass: 'tree',
    settings: [link_from, link_to, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color']
  },
  {
    id: 1.08,
    name: 'Chord Diagram',
    chartClass: 'more',
    settings: [link_from, link_to, relation, label],
    defaultShow: [true, true, true, false],
    moreSettings: ['fontSize', 'color']
  },
  {
    id: 1.09,
    name: 'Map',
    chartClass: 'map',
    settings: [coordinate, color, radius, label],
    defaultShow: [true, false, false, false],
    moreSettings: ['map', 'fontSize', 'radius', 'color'] // SVG rendering issue for map projection
  }
]

export const getChartNames = () => {
  let chartNames = {}
  charts.forEach(chart => {
    chartNames[chart.id] = chart.name
  })
  return chartNames
}

export function getSettings(chartId, header, data, dataTypes) {
  const chartIndex = charts.map(chart => chart.id).indexOf(chartId)
  const chartSettings = (chartIndex > 0) ? charts[chartIndex].settings : []
  const show = (chartIndex > 0) ? charts[chartIndex].defaultShow : []

  const numberIndices = getDataTypeIndices(dataTypes, 'number')
  const itemIndices = getDataTypeIndices(dataTypes, 'item')
  const coordinateIndices = getDataTypeIndices(dataTypes, 'coordinate')

  // default settings
  let numIdx = 0,
    itemIdx = 0,
    coordIdx = 0
  let defaultSettings = chartSettings.map((setting, index) => {
    let defaultValue = -1
    if (setting.type === 'number' && numberIndices.length >= 1 && show[index]) { // number
      defaultValue = numberIndices[numIdx]
      if (numIdx < numberIndices.length-1) numIdx += 1
    } else if (setting.type === 'item' && itemIndices.length >= 2 && show[index]) { // item
      defaultValue = itemIndices[itemIdx] 
      if (itemIdx < itemIndices.length-1) itemIdx += 1
    } else if (setting.type === 'coordinate' && coordinateIndices.length >= 1 && show[index]) { // coordinate
      defaultValue = coordinateIndices[coordIdx] 
      if (coordIdx < coordinateIndices.length-1) coordIdx += 1
    } else if (show[index]) {
      defaultValue = 0
    }
    let defaultSetting = {}
    defaultSetting[setting.value] = defaultValue
    return defaultSetting
  })
  defaultSettings = Object.assign({}, ...defaultSettings)
 
  // for the settings component
  const settingsInfo =  chartSettings.map((setting, index) => {
    let info = { value: setting.value,
      title: setting.title }
    if (setting.type === 'all') {
      info['indices'] = [...Array(header.length).keys()]
    } else if (setting.type === 'number')  {
      info['indices'] = numberIndices
    } else if (setting.type === 'item') {
      info['indices'] = itemIndices
    } else if (setting.type === 'coordinate') {
      info['indices'] = coordinateIndices
    }
    // hide the setting by default
    if (!show[index]) info['indices'] = [-1].concat(info['indices'])
    return info
  })

  return [defaultSettings, settingsInfo]
}
