import React, { Component } from 'react'
import { Nav, NavItem, NavDropdown } from 'react-bootstrap'
import { charts, chartClasses } from '../utils/settings'
import MdViewColumn from 'react-icons/lib/md/view-column'
import FaAreaChart from 'react-icons/lib/fa/area-chart'
import FaTree from 'react-icons/lib/fa/tree'
import MdMap from 'react-icons/lib/md/map'
import MdRemoveRedEye from 'react-icons/lib/md/remove-red-eye'
import GoChevronRight from 'react-icons/lib/go/chevron-right'

class Navs extends Component {
  render() {
    const icons = [
      <MdViewColumn size={16} />,
      <FaAreaChart size={16} />,
      <FaTree size={16} />,
      <MdMap size={16} />,
      <MdRemoveRedEye size={16} />
    ]
    return (
      <Nav
        bsStyle="pills"
        justified
        className="chart-navs"
        activeKey={this.props.currentChartId}
        onSelect={this.props.handleChartSelect}
      >
        {!this.props.showSide && (
          <NavItem eventKey={0} key={0}>
            <GoChevronRight size={16} />Editor
          </NavItem>
        )}
        <NavItem eventKey={charts[0].id} key={charts[0].id}>
          {icons[0]} {charts[0].name}
        </NavItem>
        {chartClasses.map((chartClass, index) => {
          return (
            <NavDropdown
              eventKey={index}
              key={index}
              id={index}
              title={
                <span>
                  {icons[index + 1]} {chartClass.name}
                </span>
              }
            >
              {charts
                .filter(chart => chart.chartClass === chartClass.chartClass)
                .map(chart => {
                  return (
                    <NavItem eventKey={chart.id} key={chart.id}>
                      {chart.name}
                    </NavItem>
                  )
                })}
            </NavDropdown>
          )
        })}
      </Nav>
    )
  }
}

export default Navs
