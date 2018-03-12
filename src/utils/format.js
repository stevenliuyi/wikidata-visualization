import * as d3 from 'd3'

export const formats = {
  none: null,
  'fixed precision': '.0f',
  'scientific notation': '.0e',
  percentage: '.0%',
  'SI pefixes': '.0s'
}

export const getFormat = (format, precision = 2) => {
  const f =
    format !== 'none'
      ? d3.format(formats[format].replace(/0/, precision))
      : d => d
  return f
}

// fill leading zeros in ISO date string for BC dates
export const formatBCDates = dateString => {
  if (typeof dateString !== 'string') return dateString

  if (dateString.slice(0, 1) === '-') {
    const yearEndIndex = dateString.slice(1).indexOf('-')
    return `-${dateString
      .slice(1, yearEndIndex + 1)
      .padStart(6, '0')}${dateString.slice(yearEndIndex + 1)}`
  } else {
    return dateString
  }
}

export const timeFormats = {
  year: '%Y',
  month: '%b %Y',
  day: '%b %d',
  hour: '%H:00',
  minute: '%H:%S'
}
