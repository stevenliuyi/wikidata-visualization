// convert the result from Wikidata to a simple json object

const numberTypes = ['integer', 'decimal'].map(type => (
  `http://www.w3.org/2001/XMLSchema#${type}`
))

function convertValue(value) {
  if (numberTypes.includes(value['datatype'])) {
    return parseFloat(value['value'])
  } else {
    return value['value']
  }
}

export function convertData(data) {
  return data.map(item => {
    let simplified_item = Object.keys(item).reduce((prev, current) => {
      prev[current] = convertValue(item[current])
      return prev
    }, {})
    return simplified_item
  })
}

// find indices of numeric fields
export function getNumberIndices(item) {
  let numeberIndices = []
  item.map((col, index) => {
    if (typeof(col) === 'number') numeberIndices.push(index)
    return null
  })

  return numeberIndices
}
