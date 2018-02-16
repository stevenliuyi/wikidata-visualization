// fetch SPARQL results from Wikidata
export const fetchSPARQLResult = sparql =>
  fetch(`https://query.wikidata.org/sparql?${sparql}&format=json`)
    .then(res => {
      return res.status >= 400 ? null : res.json()
    })
    .catch(err => {
      console.log(err)
      return null
    })

// get shortened URL from tinyurl.com
export const getTinyURL = url =>
  fetch(
    `https://cors-anywhere.herokuapp.com/http://tinyurl.com/api-create.php?url=${encodeURIComponent(
      url
    )}`
  )
    .then(res => res.text())
    .catch(err => {
      console.log(err)
      return null
    })
