import { legendColor } from 'd3-svg-legend'
// draw border
export const drawBorder = (svg, width, height, x=0, y=0) => {
  svg.append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('stroke', '#ddd')
    .style('stroke-width', 2)
}

// draw legend
export const drawLegend = (svg, colorScale, props) => {

  if (!props.moreSettings.showLegend) return null

  if (props.settings.color !== -1) {

    var legend = legendColor()
      .cells(8)
      .labelOffset(5)
      .labelFormat('.1e')
      .shapeWidth(12)
      .shapeHeight(12)
      .scale(colorScale)

    svg.append('g')
      .attr('transform',
        `translate(${props.width*props.moreSettings.legendX},${props.height*props.moreSettings.legendY})`)
      .call(legend)

    svg.select('.legendCells')
      .attr('transform', `scale(${props.moreSettings.legendScale})`)
      .selectAll('text')
      .style('font-family', 'sans-serif')
      .style('font-size', '10px')
      .style('font-weight', 'normal')
  }

}
