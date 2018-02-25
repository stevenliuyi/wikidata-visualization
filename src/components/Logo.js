import React, { Component } from 'react'
import * as d3 from 'd3'

class Logo extends Component {
  state = {
    rotating: false
  }

  logoAnimation() {
    d3
      .select('#logo-svg')
      .transition()
      .duration(2000)
      .attrTween('transform', () =>
        d3.interpolateString(`rotate(0,0,0)`, `rotate(360,0, 0)`)
      )
      .on('end', () => {
        if (this.state.rotating) this.logoAnimation()
      })
  }

  componentDidMount() {
    d3
      .select('.navbar-brand')
      .on('mouseenter', () => {
        this.logoAnimation()
        this.setState({ rotating: true })
      })
      .on('mouseleave', () => {
        this.setState({ rotating: false })
      })
  }

  render() {
    const radius = this.props.size * 0.5
    const innerRadius = radius * 0.7
    const margin = this.props.size * 0.08

    return (
      <svg id="logo-svg" width={this.props.size} height={this.props.size}>
        <defs>
          <clipPath id="clip-left">
            <path
              d={`M0 ${Math.sqrt(2) * 0.5 * margin} L${radius -
                Math.sqrt(2) * 0.5 * margin} ${radius} L0 ${2 * radius -
                Math.sqrt(2) * 0.5 * margin}`}
            />
          </clipPath>
          <clipPath id="clip-bottom">
            <path
              d={`M${Math.sqrt(2) * 0.5 * margin} ${2 *
                radius} L${radius} ${radius +
                Math.sqrt(2) * 0.5 * margin} L${2 * radius -
                Math.sqrt(2) * 0.5 * margin} ${2 * radius}`}
            />
          </clipPath>
          <clipPath id="clip-right">
            <path
              d={`M${2 * radius} ${2 * radius -
                Math.sqrt(2) * 0.5 * margin} L${radius +
                Math.sqrt(2) * 0.5 * margin} ${radius} L${2 *
                radius} ${Math.sqrt(2) * 0.5 * margin}`}
            />
          </clipPath>
          <clipPath id="clip-top">
            <path
              d={`M${2 * radius -
                Math.sqrt(2) * 0.5 * margin} 0 L${radius} ${radius -
                Math.sqrt(2) * 0.5 * margin} L${Math.sqrt(2) * 0.5 * margin} 0`}
            />
          </clipPath>
        </defs>
        {/* left arc */}
        <path
          d={`M${(1 - Math.sqrt(2) * 0.5) * radius} ${(1 - Math.sqrt(2) * 0.5) *
            radius} A ${radius} ${radius} 0 0 0 ${(1 - Math.sqrt(2) * 0.5) *
            radius} ${(1 + Math.sqrt(2) * 0.5) * radius} L${radius -
            Math.sqrt(2) * 0.5 * innerRadius} ${radius +
            Math.sqrt(2) *
              0.5 *
              innerRadius} A ${innerRadius} ${innerRadius} 0 0 1 ${radius -
            Math.sqrt(2) * 0.5 * innerRadius} ${radius -
            Math.sqrt(2) * 0.5 * innerRadius}`}
          fill="rgb(153,0,0)"
          clipPath="url(#clip-left)"
        />
        {/* bottom arc */}
        <path
          d={`M${(1 - Math.sqrt(2) * 0.5) * radius} ${(1 + Math.sqrt(2) * 0.5) *
            radius} A ${radius} ${radius} 0 0 0 ${(1 + Math.sqrt(2) * 0.5) *
            radius} ${(1 + Math.sqrt(2) * 0.5) * radius} L${radius +
            Math.sqrt(2) * 0.5 * innerRadius} ${radius +
            Math.sqrt(2) *
              0.5 *
              innerRadius} A ${innerRadius} ${innerRadius} 0 0 1 ${radius -
            Math.sqrt(2) * 0.5 * innerRadius} ${radius +
            Math.sqrt(2) * 0.5 * innerRadius}`}
          fill="rgb(51,153,102)"
          clipPath="url(#clip-bottom)"
        />
        {/* right arc */}
        <path
          d={`M${(1 + Math.sqrt(2) * 0.5) * radius} ${(1 + Math.sqrt(2) * 0.5) *
            radius} A ${radius} ${radius} 0 0 0 ${(1 + Math.sqrt(2) * 0.5) *
            radius} ${(1 - Math.sqrt(2) * 0.5) * radius} L${radius +
            Math.sqrt(2) * 0.5 * innerRadius} ${radius -
            Math.sqrt(2) *
              0.5 *
              innerRadius} A ${innerRadius} ${innerRadius} 0 0 1 ${radius +
            Math.sqrt(2) * 0.5 * innerRadius} ${radius +
            Math.sqrt(2) * 0.5 * innerRadius}`}
          fill="rgb(0,102,153)"
          clipPath="url(#clip-right)"
        />
        {/* top arc */}
        <path
          d={`M${(1 + Math.sqrt(2) * 0.5) * radius} ${(1 - Math.sqrt(2) * 0.5) *
            radius} A ${radius} ${radius} 0 0 0 ${(1 - Math.sqrt(2) * 0.5) *
            radius} ${(1 - Math.sqrt(2) * 0.5) * radius} L${radius -
            Math.sqrt(2) * 0.5 * innerRadius} ${radius -
            Math.sqrt(2) *
              0.5 *
              innerRadius} A ${innerRadius} ${innerRadius} 0 0 1 ${radius +
            Math.sqrt(2) * 0.5 * innerRadius} ${radius -
            Math.sqrt(2) * 0.5 * innerRadius}`}
          fill="rgb(51,153,102)"
          clipPath="url(#clip-top)"
        />
      </svg>
    )
  }
}

export default Logo
