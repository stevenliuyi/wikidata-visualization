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
