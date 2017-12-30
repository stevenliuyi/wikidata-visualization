// convert the result from Wikidata to objects
import * as d3 from 'd3'
import { getColorScaleFromValues } from './scales'

const numbers = ['double', 'float', 'decimal', 'integer', 'long', 'int', 'short', 'nonNegativeInteger', 'positiveInteger', 'unsignedLong', 'unsignedInt', 'unsignedShort', 'nonPositiveInteger', 'negativeInteger']
const numberTypes = numbers.map(type => (
  `http://www.w3.org/2001/XMLSchema#${type}`
))

// retunr converted value and data type associated with this value
function convertValue(value) {
  if (numberTypes.includes(value['datatype'])) {
    return [parseFloat(value['value']), 'number'] // number
  } else if (value['value'].startsWith('http://www.wikidata.org/entity/')) {
    return [value['value'].substr(31), 'item'] // Wikidata item 
  } else if (value['datatype'] === 'http://www.opengis.net/ont/geosparql#wktLiteral') {
    return [value['value'].slice(6,-1).split(' ').join(', '), 'coordinate'] // coordinate
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
  let relationships = [{'id': props.data[0][from],
    'parent': '',
    'label': label ? props.data[0][label] : '',
    'color': color ? props.data[0][color] : ''
  }]
  let ids = [props.data[0][from]]

  const allFromIds = props.data.map(item => item[from])

  props.data.map((item, index) => {
    if (item[to]) {
      // do not add duplicates and make sure the child has its own row
      // (perhaps same child with different parents could be added as two different nodes)
      if (!ids.includes(item[to]) && allFromIds.indexOf(item[to]) >= 0) { 
        relationships.push({'id':   item[to],
          'parent': item[from],
          'label':  label ? props.data[allFromIds.indexOf(item[to])][label] : '',
          'color':  color ? props.data[allFromIds.indexOf(item[to])][color] : ''
        })
        ids.push(item[to])
      }
    }
    return null
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

// get matrix for chord diagram
export function getMatrix(props) {
  const from = props.header[props.settings['link-from']]  
  const to = props.header[props.settings['link-to']]  
  const relation = props.header[props.settings['relation']] 
  const label = props.header[props.settings['label']] 

  const items = [...new Set(props.data.map(item => item[from])
    .concat(props.data.map(item => item[to])))].sort()
  // create empty matrix
  let matrix = items.map(item => items.map(item => 0))

  const labels = Array(items.length).fill('')

  // fill data into the matrix
  props.data.map(item => {
    const fromIndex = items.indexOf(item[from])
    const toIndex = items.indexOf(item[to])
    matrix[fromIndex][toIndex] += item[relation]
    if (label) labels[fromIndex] = item[label]
    return null
  })

  const colorScale = getColorScaleFromValues(items)
  const colors = items.map(item => colorScale(item))

  return [matrix, colors, labels]
}
