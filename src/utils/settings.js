// chart settings
import { getNumberIndices, getItemIndices, getCoordinateIndices } from './convertData'

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

const scatterPlotSettings = [x_axis, y_axis, label, color, radius]
const scatterPlotDefaultShow = [true, true, false, false, false]

const bubbleChartSettings = [radius, label, color]
const bubbleChartDefaultShow = [true, true, false]

const radialTreeSettings = [link_from, link_to, label, color]
const radialTreeDefaultShow = [true, true, false, false]

const radialClusterSettings = [link_from, link_to, label, color]
const radialClusterDefaultShow = [true, true, false, false]

const treeSettings = [link_from, link_to, label, color]
const treeDefaultShow = [true, true, false, false]

const clusterSettings = [link_from, link_to, label, color]
const clusterDefaultShow = [true, true, false, false]

const chordDiagramSettings = [link_from, link_to, relation, label]
const chordDiagramDefaultShow = [true, true, true, false]

const mapSettings = [coordinate, color, radius, label]
const mapDefaultShow = [true, false, false, false] 

export function getSettings(chart, sample_data) {

  let chartSettings = null; let show = null
  if (chart === 1.2) {
    chartSettings = scatterPlotSettings
    show = scatterPlotDefaultShow
  } else if (chart === 1.3) {
    chartSettings = bubbleChartSettings
    show = bubbleChartDefaultShow
  } else if (chart === 1.4) {
    chartSettings = radialTreeSettings
    show = radialTreeDefaultShow
  } else if (chart === 1.5) {
    chartSettings = radialClusterSettings
    show = radialClusterDefaultShow
  } else if (chart === 1.6) {
    chartSettings = treeSettings
    show = treeDefaultShow
  } else if (chart === 1.7) {
    chartSettings = clusterSettings
    show = clusterDefaultShow
  } else if (chart === 1.8) {
    chartSettings = chordDiagramSettings
    show = chordDiagramDefaultShow
  } else if (chart === 1.9) {
    chartSettings = mapSettings
    show =mapDefaultShow
  } else {
    return [{}, {}]
  }

  const numberIndices = getNumberIndices(Object.values(sample_data))
  const itemIndices = getItemIndices(Object.values(sample_data))
  const coordinateIndices = getCoordinateIndices(Object.values(sample_data))

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
      info['indices'] = [...Array(Object.keys(sample_data).length).keys()]
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
