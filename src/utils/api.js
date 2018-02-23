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

// get shortend URL from goo.gl
export const getGooglURL = url =>
  fetch(
    'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBK1iu6WRgS8JKKIYOQqc4eZBz8zp6tvrA',
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ longUrl: decodeURIComponent(url) })
    }
  )
    .then(res => res.json())
    .then(res => res.id)
    .catch(err => {
      console.log(err)
      return null
    })
