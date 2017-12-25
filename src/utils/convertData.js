// convert the result from Wikidata to a simple json object

function convertValue(value) {
  if (value['datatype'] === 'http://www.w3.org/2001/XMLSchema#decimal') {
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
  })

  return numeberIndices
}
