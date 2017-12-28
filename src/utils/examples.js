export const examples = [
  { title: 'Country comparison - number of Nobel laureates per capita and GDP per capita',
    filename: 'country-nobel-gdp.rq'
  },
  { title: 'Descendants of Genghis Khan',
    filename: 'genghiskhan-descendants.rq'}
]

export const readExample = (index) => {
  
  const filename = (process.env.NODE_ENV === 'development')
    ? `/examples/${examples[index]['filename']}`
    : `/wikidata-visualization/examples/${examples[index]['filename']}`
  return fetch(filename).then(res => res.text())
}

