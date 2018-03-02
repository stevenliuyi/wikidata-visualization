import md5 from 'blueimp-md5'

export const getURL = (source, width) => {
  let filename = source.substr(51)
  filename = decodeURIComponent(filename)
  filename = filename.replace(/ /g, '_')

  const hash = md5(filename)
  const hash1 = hash.substr(0, 1)
  const hash2 = hash.substr(0, 2)

  const thumb_source = `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash1}/${hash2}/${filename}/${width}-${filename}`

  return thumb_source
}

export const getCommonsFileName = url => {
  return decodeURIComponent(url.slice(url.match(/Special:FilePath/).index + 17))
}

export const getCommonsURL = filename => {
  return `http://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    filename
  )}`
}
