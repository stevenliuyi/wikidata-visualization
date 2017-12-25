// fetch SPARQL results from Wikidata
export const fetchSPARQLResult = (sparql) =>
  fetch(`https://query.wikidata.org/sparql?${sparql}&format=json`)
    .then(res => res.json())
