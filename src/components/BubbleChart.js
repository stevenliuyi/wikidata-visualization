import React, { Component } from 'react';
import { getColorScale } from '../utils/scales'
import * as d3 from 'd3';
import rd3 from 'react-d3-library'
const RD3Component = rd3.Component;

// bubble chart d3 references
// https://bl.ocks.org/mbostock/4063269
// https://jrue.github.io/coding/2014/exercises/basicbubblepackchart/
const getD3Node = (props) => {
  var colorScale =getColorScale(props)
  
  var bubble = d3.pack()
    .size([props.width, props.height])
    .padding(5);
  
  var d3node = document.createElement('div')

  var svg = d3.select(d3node)
    .append("svg")
    .attr("width", props.width)
    .attr("height", props.height)
    .attr("class", "bubble")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10")
    .attr("text-anchor", "middle")
  
    var data = props.data.map((d, index) => { d.id = index; return d; })
  
    //bubbles needs very specific format, convert data to this.
    var nodes = d3.hierarchy({children:data})
      .sum(function(d) { return d[props.header[props.settings['radius']]]; })
  
    //setup the chart
    var bubbles = svg.selectAll(".node")
      .data(bubble(nodes).leaves())
      .enter().append("g")
      .attr("class","node")
      .attr("transform", function(d) {return `translate(${d.x},${d.y})`;})
  
    //create the bubbles
    bubbles.append("circle")
      .attr("id", function(d){ return d.data['id']; })
      .attr("r", function(d){ return d.r; })
      .style("fill", function(d) { return colorScale(d.data[props.header[props.settings['color']]]); })
  
    bubbles.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.data['id']; })
      .append("use")
      .attr("xlink:href", function(d) { return "#" + d.data['id']; })

    //format the text for each bubble
    bubbles.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data['id'] + ")";})
      .attr("x", 0)
      .attr("y", 0)
      .text(function(d){ return d.data[props.header[props.settings['label']]]; })

  return d3node
} 

class BubbleChart extends Component {
  state = { d3: '' }

  componentDidMount() {
    this.setState({d3: getD3Node(this.props)})
  }

  componentWillReceiveProps() {
    this.setState({d3: getD3Node(this.props)})
  }

  render() {
    return (
      <div><RD3Component data={this.state.d3} /></div>
    )
  }
}

export default BubbleChart
