import React, { Component } from 'react';
import { Nav, NavItem, NavDropdown } from 'react-bootstrap';

class Navs extends Component {

  render() {
    return (
      <Nav bsStyle="tabs" activeKey={1} onSelect={this.props.handleChartSelect}>
        <NavDropdown eventKey={1} title={this.props.chart}>
          <NavItem eventKey={1.1}>Table</NavItem>
          <NavItem eventKey={1.2}>Scatter Chart</NavItem>
        </NavDropdown>
        <NavItem eventKey={2}>About</NavItem>
      </Nav>
    )
  }
}

export default Navs
