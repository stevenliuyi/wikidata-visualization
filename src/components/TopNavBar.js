import React, { Component } from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import GoMarkGithub from 'react-icons/lib/go/mark-github'
import Logo from './Logo'

class TopNavBar extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <span id="logo">
              <Logo size={24} />
            </span>
            <span>Wikidata Visualization</span>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem
              eventKey={1}
              onSelect={() => this.props.handleChartSelect(1)}
            >
              Charts
            </NavItem>
            <NavItem
              eventKey={2}
              onSelect={() => this.props.handleChartSelect(2)}
            >
              Query Examples
            </NavItem>
            <NavItem
              eventKey={3}
              onSelect={() => this.props.handleChartSelect(3)}
            >
              About
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem href="https://github.com/stevenliuyi/wikidata-visualization">
              <GoMarkGithub size={18} />
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default TopNavBar
