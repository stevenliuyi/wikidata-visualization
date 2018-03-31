export const examples = [
  {
    title: 'Number of Nobel laureates and GDP by country',
    filename: 'country-nobel-gdp.rq'
  },
  {
    title: 'Descendants of Genghis Khan',
    filename: 'genghiskhan-descendants.rq'
  },
  {
    title: 'Number of marriages between European countries',
    filename: 'europe-marriages.rq'
  },
  {
    title: 'Stars with Bayer designations',
    filename: 'bayer-stars.rq'
  },
  {
    title: 'Academy Award-winning families',
    filename: 'academy-award-family.rq'
  },
  {
    title: 'National Historical and Cultural Sites by province of China',
    filename: 'china-province-sites.rq'
  },
  {
    title: 'Phylogeny of human mtDNA haplogroups',
    filename: 'mtdna-haplogroup-tree.rq'
  },
  {
    title: "Richard Feynman's Erdos number",
    filename: 'feynman-erdos-number.rq'
  },
  {
    title: '20th-century earthquakes',
    filename: 'earthquakes.rq'
  },
  {
    title:
      'Impressionist and post-impressionist paintings in the Metropolitan Museum of Art',
    filename: 'met-impressionist.rq'
  },
  {
    title: 'Posthumous marriages',
    filename: 'posthumous-marriages.rq'
  },
  {
    title: 'People died in coups in Chinese history',
    filename: 'china-coup-death.rq'
  },
  {
    title: 'A Song of Ice and Fire character relationships',
    filename: 'asoiaf-characters.rq'
  },
  {
    title: 'Most common family names in Japan',
    filename: 'japanese-names.rq'
  },
  {
    title: 'Giant pandas',
    filename: 'giant-pandas.rq'
  },
  {
    title: 'Party and State Leaders of China',
    filename: 'china-leaders.rq'
  },
  {
    title: 'Tennis Career Grand Slam',
    filename: 'tennis-grand-slam.rq'
  },
  {
    title: 'Most cited machine learning papers',
    filename: 'machine-learning-papers.rq'
  },
  {
    title: 'Craters on the Moon named after French people',
    filename: 'moon-craters-french.rq'
  },
  {
    title: 'Heads of state and government during the World War II',
    filename: 'wwii-heads.rq'
  },
  {
    title: 'Sister cities between capitals of Asia and Africa countries',
    filename: 'asia-africa-sister-cities.rq'
  },
  {
    title: 'Phylogeny of dinosaurs',
    filename: 'dinosaur-phylogeny.rq'
  },
  {
    title:
      'Dimensionless quantities in fluid mechanics that involving viscosity',
    filename: 'viscosity-dimensionless-number.rq'
  },
  {
    title: 'Popes that have offsprings',
    filename: 'pope-offsprings.rq'
  },
  {
    title: 'Sorting algorithms',
    filename: 'sorting-algorithm.rq'
  },
  {
    title: 'Universities within 1km from a city hall',
    filename: 'university-city-hall.rq'
  },
  {
    title: 'Spouses of Kings of the Joseon Dynasty',
    filename: 'joseon-king-spouses.rq'
  },
  {
    title: 'Women married to both father and son',
    filename: 'father-son-marriages.rq'
  },
  {
    title: 'NBA teams with the most championships',
    filename: 'nba-champions.rq'
  },
  {
    title: 'German people honored by Google Doodle',
    filename: 'google-doodle-germany.rq'
  },
  {
    title: 'Distribution of the surname Li in China',
    filename: 'li-distribution.rq'
  }
]

export const readExample = index => {
  const filename =
    process.env.NODE_ENV === 'development'
      ? `/examples/${examples[index]['filename']}`
      : `${process.env.PUBLIC_URL}/examples/${examples[index]['filename']}`
  return fetch(filename).then(res => res.text())
}
