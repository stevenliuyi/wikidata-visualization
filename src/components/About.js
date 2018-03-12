import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import Logo from './Logo'
import Measure from 'react-measure'

class About extends Component {
  state = {
    width: -1
  }

  render() {
    return (
      <Row>
        <Col sm={12}>
          <h2>
            <span className="app-name text-muted">Wikidata Visualization</span>
          </h2>
        </Col>
        <Col sm={8} xs={12} className="text-muted">
          <p>
            This web app provides various easy-to-configure tools for
            visualizing{' '}
            <a href="https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service">
              Wikidata SPARQL query results
            </a>. The tools are mainly build on top of{' '}
            <a href="https://d3js.org/">D3.js</a>, but a few other JavaScript
            libraries (e.g. <a href="http://leafletjs.com/">Leaflet</a>) are
            also used.
          </p>

          <p>
            SPARQL query examples are provided for users to explore, and you can
            find more examples{' '}
            <a href="https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples">
              here
            </a>{' '}
            on the Wikidata website.
          </p>

          <p>
            The source code is available on{' '}
            <a href="https://github.com/stevenliuyi/wikidata-visualization">
              Github
            </a>. If you encounter any problem, you can contact me on Github or{' '}
            <a href="https://www.wikidata.org/wiki/User:Stevenliuyi">
              Wikidata
            </a>.
          </p>
        </Col>
        <Col sm={4} xsHidden>
          <Measure
            bounds
            onResize={contentRect => {
              this.setState({ width: contentRect.bounds.width })
            }}
            ref="measure"
          >
            {({ measureRef }) => (
              <div ref={measureRef}>
                <Logo size={this.state.width * 0.8} id="about-logo-svg" />
              </div>
            )}
          </Measure>
        </Col>
      </Row>
    )
  }
}

export default About
