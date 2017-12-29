export const examples = [
  { title: 'Country comparison - number of Nobel laureates per capita and GDP per capita',
    filename: 'country-nobel-gdp.rq'
  },
  { title: 'Descendants of Genghis Khan',
    filename: 'genghiskhan-descendants.rq'
  },
  { title: 'Number of marriages between European countries',
    filename: 'europe-marriages.rq'
  },
  {
    title: 'Stars with Bayer designations',
    filename: 'bayer-stars.rq'
  }
]

export const readExample = (index) => {
  
  const filename = (process.env.NODE_ENV === 'development')
    ? `/examples/${examples[index]['filename']}`
    : `/wikidata-visualization/examples/${examples[index]['filename']}`
  return fetch(filename).then(res => res.text())
}

