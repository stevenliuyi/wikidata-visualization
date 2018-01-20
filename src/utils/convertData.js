// convert the result from Wikidata to objects
import * as d3 from 'd3'
import { getColorScaleFromValues, getColors } from './scales'

const numbers = ['double', 'float', 'decimal', 'integer', 'long', 'int', 'short', 'nonNegativeInteger', 'positiveInteger', 'unsignedLong', 'unsignedInt', 'unsignedShort', 'nonPositiveInteger', 'negativeInteger']
const numberTypes = numbers.map(type => (
  `http://www.w3.org/2001/XMLSchema#${type}`
))

// return converted value and data type associated with this value
function convertValue(value) {
  if (numberTypes.includes(value['datatype'])) {
    return [parseFloat(value['value']), 'number'] // number
  } else if (value['value'].startsWith('http://www.wikidata.org/entity/')) {
    return [value['value'].substr(31), 'item'] // Wikidata item 
  } else if (value['datatype'] === 'http://www.opengis.net/ont/geosparql#wktLiteral') {
    return [value['value'].slice(6,-1).split(' ').join(', '), 'coordinate'] // coordinate
  } else if (value['value'].startsWith('http://commons.wikimedia.org/wiki/Special:FilePath')) {
    return [value['value'], 'image']
  } else {
    return [value['value'], 'string']
  }
}

export function convertData(header, data) {
  // will store data types into this array
  let data_types = Array(header.length).fill('')

  const new_data = data.map(item => {
    let simplified_item = Object.keys(item).reduce((prev, current) => {
      [prev[current], data_types[header.indexOf(current)]] = convertValue(item[current])
      return prev
    }, {})
    return simplified_item
  })

  return [new_data, data_types]
}

// find indices of a given data type
export function getDataTypeIndices(dataTypes, currentDataType) {
  return dataTypes.map((type, i) => type === currentDataType ? i : '')
    .filter(String)
}

// get tree relationships (child-parent pairs) from data
export function getTreeRoot(props) {
  const from = props.header[props.settings['link-from']]  
  const to = props.header[props.settings['link-to']]  
  const label = props.header[props.settings['label']] 
  const color = props.header[props.settings['color']] 
  
  // root
  let relationships = [{'id': props.data[props.rowSelections[0]][from],
    'parent': '',
    'label': label ? props.data[props.rowSelections[0]][label] : '',
    'color': color ? props.data[props.rowSelections[0]][color] : ''
  }]
  let ids = [props.data[props.rowSelections[0]][from]]

  const selectedData = props.data.filter((item, i) => props.rowSelections.includes(i))

  const allFromIds = selectedData.map(item => item[from])

  selectedData.forEach((item, index) => {
    if (item[to]) {
      // do not add duplicates and make sure the child has its own row
      // (perhaps same child with different parents could be added as two different nodes)
      if (!ids.includes(item[to]) && allFromIds.indexOf(item[to]) >= 0) { 
        relationships.push({'id':   item[to],
          'parent': item[from],
          'label':  label ? selectedData[allFromIds.indexOf(item[to])][label] : '',
          'color':  color ? selectedData[allFromIds.indexOf(item[to])][color] : ''
        })
        ids.push(item[to])
      }
    }
  })

  try {
    const stratify = d3.stratify()
      .id(function(d) { return d['id'] })
      .parentId(function(d) { return d['parent'] })
    const root = stratify(relationships)
    return root
  } catch(err) {
    console.log('Error encountered while generating the tree!')
    console.log(err)
  }
  return null
}

// get matrix (rows and columns are the same) for chord diagram
export function getMatrix(props) {
  const from = props.header[props.settings['link-from']]  
  const to = props.header[props.settings['link-to']]  
  const relation = props.header[props.settings['relation']] 
  const label = props.header[props.settings['label']] 

  const selectedData = props.data.filter((item, i) => props.rowSelections.includes(i))

  const items = [...new Set(selectedData.map(item => item[from])
    .concat(selectedData.map(item => item[to])))].sort()
  // create empty matrix
  let matrix = items.map(item => items.map(item => 0))

  const labels = Array(items.length).fill('')

  // fill data into the matrix
  selectedData.forEach(item => {
    const fromIndex = items.indexOf(item[from])
    const toIndex = items.indexOf(item[to])
    matrix[fromIndex][toIndex] += item[relation]
    if (label) labels[fromIndex] = item[label]
  })

  const colorScale = getColorScaleFromValues(items, props.moreSettings.color)
  const colors = items.map(item => colorScale(item))

  return [matrix, colors, labels]
}

// get matrix (rows and columns are not the same in general) for heat map
export function getMatrix2(props) {
  const from = props.header[props.settings['link-from']]  
  const to = props.header[props.settings['link-to']]  
  const label_from = props.header[props.settings['label_from']] 
  const label_to = props.header[props.settings['label_to']] 
  const sort_row = props.moreSettings.sortRow
  const sort_col = props.moreSettings.sortColumn

  const selectedData = props.data.filter((item, i) => props.rowSelections.includes(i))

  const colors = getColors(props)

  const maxItem = (a, b) => {
    if (typeof(a) === 'number' || typeof(b) === 'number') {
      return (a > b) ? a : b
    } else {
      return (a != null) ? a : b
    }
  }

  let row_items = [...new Set(selectedData.map(item => item[from]))]
  let col_items = [...new Set(selectedData.map(item => item[to]))]

  // sort row and column
  let row_valToBeSorted = row_items.map(row_item => null)
  let col_valToBeSorted = col_items.map(col_item => null)

  selectedData.forEach((item, i) => {
    const rowIndex = row_items.indexOf(item[from])
    const colIndex = col_items.indexOf(item[to])
    row_valToBeSorted[rowIndex] = maxItem(row_valToBeSorted[rowIndex], item[sort_row])
    col_valToBeSorted[colIndex] = maxItem(col_valToBeSorted[colIndex], item[sort_col])
  })

  const row_indices = [...row_items.keys()].sort((a, b) => {
    return (row_valToBeSorted[a] < row_valToBeSorted[b]) ? -1 : 1
  })
  const col_indices = [...col_items.keys()].sort((a, b) => {
    return (col_valToBeSorted[a] < col_valToBeSorted[b]) ? -1 : 1
  })

  row_items = row_indices.map(i => row_items[i])
  col_items = col_indices.map(i => col_items[i])
  
  // initialize labels
  let row_labels = row_items.map(row_item => '')
  let col_labels = col_items.map(col_item => '')

  // initialize matrix
  let matrix = row_items.map((row_item, i) => col_items.map(col_item => ({
    color: 'white',
    row: i
  })))

  selectedData.forEach((item, i) => {
    const rowIndex = row_items.indexOf(item[from])
    const colIndex = col_items.indexOf(item[to])
    matrix[rowIndex][colIndex] = {
      color: colors[i],
      row: rowIndex
    }
    row_labels[rowIndex] = item[label_from]
    col_labels[colIndex] = item[label_to]
  })
  
  return [matrix, row_labels, col_labels]
}

export function getGraph(props, link_index = false) {
  // link_index: use index or Qid for sources/targets 
  const from = props.header[props.settings['link-from']]  
  const to = props.header[props.settings['link-to']]  
  const label_from = props.header[props.settings['label_from']] 
  const label_to = props.header[props.settings['label_to']] 
  const edge_label = props.header[props.settings['edge_label']] 
  const color = props.header[props.settings['color']]
  const relation = props.header[props.settings['relation']]
  const color_from = props.header[props.settings['color_from']]
  const color_to = props.header[props.settings['color_to']]
  
  const selectedData = props.data.filter((item, i) => props.rowSelections.includes(i))

  // nodes
  const items = [...new Set(selectedData.map(item => item[from])
    .concat(selectedData.map(item => item[to])))]
  const nodes = items.map(q => ({ id: q }))

  // add labels to nodes
  if (label_from || label_to || color || color_from || color_to ) {
    selectedData.forEach(item => {
      const toIndex = items.indexOf(item[to])
      const fromIndex = items.indexOf(item[from])
      nodes[toIndex]['label'] = (item[label_to]) ? item[label_to] : ''
      nodes[fromIndex]['label'] = (item[label_from]) ? item[label_from] : ''
      nodes[fromIndex]['color'] = (item[color]) ? item[color] : null
      nodes[toIndex]['color'] = (item[color_to]) ? item[color_to] : null
      nodes[fromIndex]['color'] = (item[color_from]) ? item[color_from] : null
    })
  }

  // links
  const links = selectedData.filter( item => item[from] && item[to] ) // make sure both nodes exist
    .map((item, idx) => ({
      index: idx,
      source: (link_index) ? items.findIndex(element => (element === item[from])) : item[from],
      target: (link_index) ? items.findIndex(element => (element === item[to])) : item[to],
      edgeLabel: item[edge_label],
      value: (relation != null) ? item[relation] : 1
    }))

  return { nodes, links }

}
