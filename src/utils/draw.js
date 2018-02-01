import * as d3 from 'd3'
import { parseSvg } from 'd3-interpolate/src/transform/parse'
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
        `translate(${props.width*0.8},${props.height*0.02})`)
      .call(legend)

    svg = svg.select('.legendCells')
      .attr('transform', `scale(${props.moreSettings.legendScale})`)
      .call(d3.drag()
        .on('drag', dragged))
      .on('mousemove', function(d) {
        d3.select('.d3ToolTip')
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY + 10 + 'px')
          .style('display', 'inline-block')
          .html('<span>drag to reposition legend</span>')
      })
      .on('mouseout', function(d) {
        d3.select('.d3ToolTip')
          .style('display', 'none')
      })

    svg.selectAll('text')
      .style('font-family', 'sans-serif')
      .style('font-size', '10px')
      .style('font-weight', 'normal')
      
    function dragged(d) {
      d3.select('.d3ToolTip')
        .style('display', 'none')
      const t = parseSvg(d3.select('.legendCells').attr('transform'))
      d3.select('.legendCells')
        .attr('transform', `translate(${t.translateX+d3.event.dx},${t.translateY+d3.event.dy}) scale(${t.scaleX})`)
    }
  }

}
