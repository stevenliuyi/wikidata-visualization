import React, { Component } from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import GoMarkGithub from 'react-icons/lib/go/mark-github'

class TopNavBar extends Component {

  render() {
    return (
      <Navbar>
        <Navbar.Header><Navbar.Brand>Wikidata Visualization</Navbar.Brand></Navbar.Header>
        <Nav>
          <NavItem eventKey={1} onSelect={() => this.props.handleChartSelect(1)}>Charts</NavItem>
          <NavItem eventKey={2} onSelect={() => this.props.handleChartSelect(2)}>Query Examples</NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem href='https://github.com/stevenliuyi/wikidata-visualization'>
            <GoMarkGithub size={18} />
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default TopNavBar
