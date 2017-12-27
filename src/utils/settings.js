// chart settings
import { getNumberIndices } from './convertData'

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

const scatterPlotSettings = [x_axis, y_axis, label, color, radius]
const scatterPlotDefaultShow = [true, true, false, false, false]

const bubbleChartSettings = [radius, label, color]
const bubbleChartDefaultShow = [true, true, false]

export function getSettings(chart, sample_data) {

  let chartSettings = null; let show = null
  if (chart === 1.2) {
    chartSettings = scatterPlotSettings
    show = scatterPlotDefaultShow
  } else if (chart === 1.3) {
    chartSettings = bubbleChartSettings
    show = bubbleChartDefaultShow
  } else {
    return [{}, {}]
  }

  const numberIndices = getNumberIndices(Object.values(sample_data))

  // default settings
  let index = 0
  let defaultSettings = chartSettings.map((setting, index) => {
    let defaultValue = -1
    if (setting.type === 'number' && numberIndices.length > 1 && show[index]) {
      defaultValue = numberIndices[index]
      if (index < numberIndices.length-1) index += 1
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
    } else  {
      info['indices'] = numberIndices
    }
    // hide the setting by default
    if (!show[index]) info['indices'] = [-1].concat(info['indices'])
    return info
  })

  return [defaultSettings, settingsInfo]
}
