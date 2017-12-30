import React, { Component } from 'react'
import { Nav, NavItem, NavDropdown } from 'react-bootstrap'
import { charts, chartClasses } from '../utils/settings'

class Navs extends Component {

  render() {
    return (
      <Nav
        bsStyle="pills"
        className='chart-navs'
        activeKey={this.props.currentChartId}
        onSelect={this.props.handleChartSelect}>
        <NavItem eventKey={charts[0].id}  key={charts[0].id}>{charts[0].name}</NavItem>
        { chartClasses.map((chartClass, index) => {
          return (
            <NavDropdown eventKey={index} title={chartClass.name}>
              {
                charts.filter(chart => chart.chartClass === chartClass.chartClass).map(chart => {
                  return (
                    <NavItem eventKey={chart.id} key={chart.id}>{chart.name}</NavItem>
                  )
                })
              }
            </NavDropdown>
          )
        })
        }
      </Nav>
    )
  }
}

export default Navs
