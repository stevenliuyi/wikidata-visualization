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
