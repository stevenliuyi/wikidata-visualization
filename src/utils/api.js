// fetch SPARQL results from Wikidata
export const fetchSPARQLResult = (sparql) =>
  fetch(`https://query.wikidata.org/sparql?${sparql}&format=json`)
    .then(res => {
      return (res.status >= 400) ? null : res.json()
    })
    .catch(err => { console.log(err); return null })
