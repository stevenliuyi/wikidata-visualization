// chart settings
import { getDataTypeIndices } from './convertData'

const x_axis = {
  value: 'x-axis',
  title: 'X-axis',
  type: 'number'
}

const x_axis_all = {
  value: 'x-axis-all',
  title: 'X-axis',
  type: 'all'
}

const axes = {
  value: 'axes',
  title: 'Axes',
  type: 'all'
}

const y_axis = {
  value: 'y-axis',
  title: 'Y-axis',
  type: 'number'
}

const y_axis_groups = {
  value: 'y-axis-groups',
  title: 'Values',
  type: 'number'
}

const value = {
  value: 'value',
  title: 'Value',
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

const coordinate_from = {
  value: 'coordinate_from',
  title: 'Link from coordinate',
  type: 'coordinate'
}

const coordinate_to = {
  value: 'coordinate_to',
  title: 'Link to coordinate',
  type: 'coordinate'
}

const label_from = {
  value: 'label_from',
  title: 'Label 1',
  type: 'all'
}

const label_to = {
  value: 'label_to',
  title: 'Label 2',
  type: 'all'
}

const color_from = {
  value: 'color_from',
  title: 'Color 1',
  type: 'all'
}

const color_to = {
  value: 'color_to',
  title: 'Color 2',
  type: 'all'
}

const edge_label = {
  value: 'edge_label',
  title: 'Edge label',
  type: 'all'
}

const area = {
  value: 'area',
  title: 'Area',
  type: 'number'
}

const region = {
  value: 'region',
  title: 'Region items',
  type: 'item'
}

const image = {
  value: 'image',
  title: 'Image',
  type: 'image'
}

const texts = {
  value: 'texts',
  title: 'Texts',
  type: 'all'
}

const ngroups = {
  value: 'ngroups',
  title: 'Number of groups',
  type: 'slider',
  defaultValue: 1,
  props: {
    step: 1,
    min: 1,
    max: 10
  }
}

const start_time = {
  value: 'start-time',
  title: 'Start time',
  type: 'time'
}

const end_time = {
  value: 'end-time',
  title: 'End time',
  type: 'time'
}

export const moreSettings = {
  fontSize: '8pt',
  radius: [5, 40],
  color: 'Spectral',
  map: 'World',
  map2: 'World',
  projection: 'mercator',
  edgeFontSize: 8,
  strength: -30,
  iterations: 20,
  nodeWidth: 16,
  nodePadding: 5,
  sortRow: 'none',
  sortColumn: 'none',
  baseMap: 'OpenStreetMap',
  showCircles: true,
  showMarkers: false,
  showArrows: false,
  ignoreCase: true,
  regex: false,
  reasonator: false,
  numericRangeFilter: false,
  timeRangeFilter: false,
  delimiter: ' ',
  case: 'default',
  sizeScale: 'linear',
  fontSizes: [10, 40],
  showLegend: false,
  legendScale: 1,
  rotation: 0,
  solarSystem: 'Earth',
  mapResolution: false,
  barType: 'stacked',
  outerRadius: 15,
  innerRadius: 70,
  timelineType: 'separated',
  padding: 10,
  lineType: 'geodesic',
  lineWidth: 1.5,
  padAngle: 5,
  numOfColumns: 1,
  effect: 'no effect',
  showLabels: false
}

export const moreSettingTitles = {
  fontSize: 'Font size',
  radius: 'Radius',
  color: 'Colors',
  map: 'Region',
  map2: 'Region',
  projection: 'Map projection',
  edgeFontSize: 'Edge font size',
  strength: 'Strength',
  iterations: 'Iterations',
  nodeWidth: 'Node width',
  nodePadding: 'Node padding',
  sortRow: 'Sort row by',
  sortColumn: 'Sort column by',
  baseMap: 'Base map',
  showCircles: 'Circles',
  showMarkers: 'Markers',
  showArrows: 'Arrows',
  ignoreCase: 'Ignore case',
  regex: 'Regex filter',
  reasonator: 'External links',
  numericRangeFilter: 'Numeric range filter',
  timeRangeFilter: 'Time range filter',
  delimiter: 'Delimiter',
  case: 'Case',
  sizeScale: 'Size scale',
  fontSizes: 'Font sizes',
  showLegend: 'Legend',
  legendScale: 'Legend size',
  rotation: 'Max rotation',
  solarSystem: 'Solar system',
  mapResolution: 'Map resolution',
  barType: 'Bar type',
  outerRadius: 'Radius',
  innerRadius: 'Inner radius',
  timelineType: 'Timeline type',
  padding: 'Padding',
  lineType: 'Line type',
  lineWidth: 'Line width',
  padAngle: 'Padding angle',
  numOfColumns: 'Number of columns',
  effect: 'Image effect',
  showLabels: 'Pie chart labels'
}

export const canvasSettings = {
  auto: true,
  width: 500,
  height: -1,
  border: false
}

export const canvasSettingTitles = {
  auto: 'Auto width',
  width: 'Width',
  height: 'Height',
  border: 'Border'
}

export const axisSettings = {
  xformat: 'none',
  yformat: 'none',
  format: 'none',
  xprecision: 2,
  yprecision: 2,
  precision: 2,
  xtimeprecision: 'year',
  ytimeprecision: 'year',
  xgridlines: true,
  ygridlines: true,
  xticks: 4,
  yticks: 4,
  ticks: 4
}

export const axisSettingTitles = {
  xformat: 'X value format',
  yformat: 'Y value format',
  format: 'Axis value format',
  xprecision: 'X value precision',
  yprecision: 'Y value precision',
  precision: 'Axis value precision',
  xtimeprecision: 'X time precision',
  ytimeprecision: 'Y time precision',
  xgridlines: 'X grid lines',
  ygridlines: 'Y grid lines',
  xticks: 'X ticks',
  yticks: 'Y ticks',
  ticks: 'Axis ticks'
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
    name: 'Table',
    moreSettings: [
      'ignoreCase',
      'regex',
      'numericRangeFilter',
      'timeRangeFilter',
      'reasonator'
    ]
  },
  {
    id: 1.02,
    name: 'Scatter Chart',
    chartClass: 'basic',
    settings: [x_axis, y_axis, label, color, radius],
    defaultShow: [true, true, false, false, false],
    moreSettings: ['fontSize', 'radius', 'color', 'showLegend', 'legendScale'],
    axisSettings: [
      'xformat',
      'xprecision',
      'xtimeprecision',
      'yformat',
      'yprecision',
      'ytimeprecision',
      'xgridlines',
      'ygridlines',
      'xticks',
      'yticks'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.03,
    name: 'Bubble Chart',
    chartClass: 'basic',
    settings: [radius, label, color],
    defaultShow: [true, true, false],
    moreSettings: ['fontSize', 'color', 'showLegend', 'legendScale'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.18,
    name: 'Bar Chart',
    chartClass: 'basic',
    settings: [x_axis_all, y_axis_groups, ngroups],
    defaultShow: [true, true, true],
    moreSettings: ['barType', 'fontSize', 'color', 'showLegend', 'legendScale'],
    axisSettings: ['ygridlines', 'yformat', 'yprecision', 'yticks'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.2,
    name: 'Pie Chart',
    chartClass: 'basic',
    settings: [value, label, color],
    defaultShow: [true, false, false],
    moreSettings: [
      'fontSize',
      'color',
      'innerRadius',
      'showLegend',
      'legendScale'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.19,
    name: 'Radar Chart',
    chartClass: 'basic',
    settings: [axes, y_axis_groups, ngroups],
    defaultShow: [true, true, true],
    moreSettings: ['fontSize', 'color', 'showLegend', 'legendScale'],
    axisSettings: ['format', 'precision', 'ticks'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.1,
    name: 'Force-directed Graph',
    chartClass: 'basic',
    settings: [
      link_from,
      link_to,
      label_from,
      label_to,
      edge_label,
      color_from,
      color_to
    ],
    defaultShow: [true, true, false, false, false, false, false],
    moreSettings: [
      'strength',
      'showArrows',
      'fontSize',
      'edgeFontSize',
      'color'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.06,
    name: 'Tree',
    chartClass: 'tree',
    settings: [link_from, link_to, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color', 'showLegend', 'legendScale'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.07,
    name: 'Cluster',
    chartClass: 'tree',
    settings: [link_from, link_to, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color', 'showLegend', 'legendScale'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.04,
    name: 'Radial Tree',
    chartClass: 'tree',
    settings: [link_from, link_to, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color', 'showLegend', 'legendScale'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.05,
    name: 'Radial Cluster',
    chartClass: 'tree',
    settings: [link_from, link_to, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color', 'showLegend', 'legendScale'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.22,
    name: 'Circle  Packing',
    chartClass: 'tree',
    settings: [link_from, link_to, radius, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: ['fontSize', 'color', 'showLegend', 'legendScale'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.16,
    name: 'Map',
    chartClass: 'map',
    settings: [
      coordinate,
      color,
      radius,
      label,
      coordinate_from,
      coordinate_to
    ],
    defaultShow: [true, false, false, false, false, false],
    moreSettings: [
      'solarSystem',
      'baseMap',
      'mapResolution',
      'showCircles',
      'showMarkers',
      'fontSize',
      'radius',
      'color',
      'lineType',
      'lineWidth',
      'showLegend',
      'legendScale'
    ],
    canvasSettings: ['auto', 'width', 'height']
  },
  {
    id: 1.09,
    name: 'Simple Map',
    chartClass: 'map',
    settings: [
      coordinate,
      color,
      radius,
      label,
      coordinate_from,
      coordinate_to
    ],
    defaultShow: [true, false, false, false, false, false],
    moreSettings: [
      'map',
      'projection',
      'fontSize',
      'radius',
      'color',
      'showLegend',
      'legendScale',
      'lineType',
      'lineWidth'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.13,
    name: 'Choropleth',
    chartClass: 'map',
    settings: [region, color],
    defaultShow: [true, false],
    moreSettings: [
      'map2',
      'projection',
      'fontSize',
      'color',
      'showLegend',
      'legendScale'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.11,
    name: 'Cartogram',
    chartClass: 'map',
    settings: [region, area, color],
    defaultShow: [true, true, false],
    moreSettings: ['map2', 'iterations', 'color', 'showLegend', 'legendScale'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.23,
    name: 'Pie Chart Map',
    chartClass: 'map',
    settings: [coordinate, y_axis_groups, ngroups, label],
    defaultShow: [true, true, true, false],
    moreSettings: [
      'map',
      'projection',
      'fontSize',
      'color',
      'outerRadius',
      'innerRadius',
      'showLabels',
      'showLegend',
      'legendScale'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.08,
    name: 'Chord Diagram',
    chartClass: 'more',
    settings: [link_from, link_to, relation, label],
    defaultShow: [true, true, true, false],
    moreSettings: [
      'fontSize',
      'color',
      'innerRadius',
      'padAngle',
      'showLegend',
      'legendScale'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.14,
    name: 'Sankey Diagram',
    chartClass: 'more',
    settings: [
      link_from,
      link_to,
      relation,
      label_from,
      label_to,
      edge_label,
      color_from,
      color_to
    ],
    defaultShow: [true, true, false, false, false, false],
    moreSettings: ['fontSize', 'color', 'nodeWidth', 'nodePadding'],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.15,
    name: 'Heatmap',
    chartClass: 'more',
    settings: [link_from, link_to, color, label_from, label_to],
    defaultShow: [true, true, true, false, false],
    moreSettings: [
      'sortRow',
      'sortColumn',
      'fontSize',
      'color',
      'showLegend',
      'legendScale'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.21,
    name: 'Timeline',
    chartClass: 'more',
    settings: [start_time, end_time, label, color],
    defaultShow: [true, true, false, false],
    moreSettings: [
      'timelineType',
      'padding',
      'fontSize',
      'color',
      'showLegend',
      'legendScale'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.17,
    name: 'Word Cloud',
    chartClass: 'more',
    settings: [texts],
    defaultShow: [true],
    moreSettings: [
      'delimiter',
      'case',
      'fontSizes',
      'sizeScale',
      'rotation',
      'color'
    ],
    canvasSettings: ['auto', 'width', 'height', 'border']
  },
  {
    id: 1.12,
    name: 'Gallery',
    chartClass: 'more',
    settings: [image, label],
    defaultShow: [true, false],
    moreSettings: ['numOfColumns', 'effect'],
    canvasSettings: []
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
  const chartSettings = chartIndex > 0 ? charts[chartIndex].settings : []
  const show = chartIndex > 0 ? charts[chartIndex].defaultShow : []

  let numberIndices = getDataTypeIndices(dataTypes, 'number')
  const itemIndices = getDataTypeIndices(dataTypes, 'item')
  const coordinateIndices = getDataTypeIndices(dataTypes, 'coordinate')
  const imageIndices = getDataTypeIndices(dataTypes, 'image')
  const timeIndices = getDataTypeIndices(dataTypes, 'time')
  numberIndices = numberIndices.concat(timeIndices) // conbime number and time types

  // default settings
  let numIdx = 0,
    itemIdx = 0,
    coordIdx = 0,
    imageIdx = 0,
    timeIdx = 0
  let defaultSettings = chartSettings.map((setting, index) => {
    let defaultValue = -1
    if (setting.type === 'number' && numberIndices.length >= 1 && show[index]) {
      // number
      defaultValue = numberIndices[numIdx]
      if (numIdx < numberIndices.length - 1) numIdx += 1
    } else if (
      setting.type === 'item' &&
      itemIndices.length >= 1 &&
      show[index]
    ) {
      // item
      defaultValue = itemIndices[itemIdx]
      if (itemIdx < itemIndices.length - 1) itemIdx += 1
    } else if (
      setting.type === 'coordinate' &&
      coordinateIndices.length >= 1 &&
      show[index]
    ) {
      // coordinate
      defaultValue = coordinateIndices[coordIdx]
      if (coordIdx < coordinateIndices.length - 1) coordIdx += 1
    } else if (
      setting.type === 'image' &&
      imageIndices.length >= 1 &&
      show[index]
    ) {
      // image
      defaultValue = imageIndices[coordIdx]
      if (imageIdx < imageIndices.length - 1) imageIdx += 1
    } else if (
      setting.type === 'time' &&
      timeIndices.length >= 1 &&
      show[index]
    ) {
      // time
      defaultValue = timeIndices[timeIdx]
      if (timeIdx < timeIndices.length - 1) timeIdx += 1
    } else if (setting.type === 'slider') {
      // slider
      defaultValue = setting.defaultValue
    } else if (show[index]) {
      defaultValue = 0
    }
    let defaultSetting = {}
    defaultSetting[setting.value] = defaultValue
    return defaultSetting
  })
  defaultSettings = Object.assign({}, ...defaultSettings)

  // set default value for all group members
  if (Object.keys(defaultSettings).includes('y-axis-groups')) {
    ;[...Array(9).keys()].forEach((_, idx) => {
      defaultSettings[`y-axis-groups${idx + 1}`] =
        defaultSettings['y-axis-groups']
    })
  }

  // for the settings component
  const settingsInfo = chartSettings.map((setting, index) => {
    let info = {
      value: setting.value,
      title: setting.title,
      type: setting.type,
      props: setting.props
    }
    if (setting.type === 'all') {
      info['indices'] = [...Array(header.length).keys()]
    } else if (setting.type === 'number') {
      info['indices'] = numberIndices
    } else if (setting.type === 'item') {
      info['indices'] = itemIndices
    } else if (setting.type === 'coordinate') {
      info['indices'] = coordinateIndices
    } else if (setting.type === 'image') {
      info['indices'] = imageIndices
    } else if (setting.type === 'time') {
      info['indices'] = timeIndices
    }
    // hide the setting by default
    if (!show[index]) info['indices'] = [-1].concat(info['indices'])
    return info
  })

  return [defaultSettings, settingsInfo]
}
