import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown } from 'react-bootstrap';

class Navs extends Component {

  render() {
    return (
      <Nav bsStyle="tabs" activeKey={1} onSelect={this.props.handleChartSelect}>
        <NavDropdown eventKey={1} title={this.props.currentChart} id="chart-nav">
          { Object.keys(this.props.charts).map( chartId => {
              return (
                <NavItem eventKey={chartId} key={chartId}>{this.props.charts[chartId]}</NavItem>
              )
            })
          }
        </NavDropdown>
        <NavItem eventKey={2}>Examples</NavItem>
      </Nav>
    )
  }
}

export default Navs
