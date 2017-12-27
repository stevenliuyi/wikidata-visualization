export const examples = [
  { title: 'Country comparison - number of Nobel laureates per capita and GDP per capita',
    filename: 'country-nobel-gdp.rq'
  }
]

export const readExample = (index) => {
  const filename = `/examples/${examples[index]['filename']}`
  return fetch(filename).then(res => res.text())
}

