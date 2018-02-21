import React, { Component } from 'react'
import { Well } from 'react-bootstrap'
import MdHighlightRemove from 'react-icons/lib/md/highlight-remove'

const iconStyle = {
  verticalAlign: 'bottom'
}

class ErrorBoundary extends Component {
  state = {
    hasError: false
  }

  componentDidCatch(err, info) {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grey-text">
          <Well className="info-text">
            <MdHighlightRemove size={20} style={iconStyle} />
            <span>
              &nbsp;Oops! Something went wrong. If the problem persists, you
              could raise an issue on{' '}
              <a href="https://github.com/stevenliuyi/wikidata-visualization">
                the Github repository
              </a>{' '}
              or contact me on{' '}
              <a href="https://www.wikidata.org/wiki/User:Stevenliuyi">
                Wikidata
              </a>.
            </span>
          </Well>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}

export default ErrorBoundary
