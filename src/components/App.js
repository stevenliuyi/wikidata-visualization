import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { PageHeader, Grid, Row, Col } from 'react-bootstrap';
import Query from './Query';
import Settings from './Settings';
import Chart from './Chart';
import DataTable from './DataTable';
import Navs from './Navs';
import * as WikidataAPI from '../utils/api';
import { convertData, getNumberIndices } from '../utils/convertData';

class App extends Component {
  state = {
    data: [],
    header: [],
    numberIndices: [],
    status: "",
    numResults: 0,
    settings: {},
    chart: 1.1,
    chartName: 'Table'
  }

  handleChartSelect = (selected) => {
    const chartNames = {
      1.1: 'Table',
      1.2: 'Scatter Chart'
    }
    this.setState({ chart: selected })
    if (selected < 2) this.setState({ chartName: chartNames[selected] })
  }

  getSPARQLResult = (code) => {
    this.setState({ status: "waiting" })
    const query = `query=${encodeURIComponent(code)}`
    WikidataAPI.fetchSPARQLResult(query)
      .then(data => {
        if (data === null) {
          this.setState({ status: "error" })
          return null
        } else if (data.length === 0) {
          this.setState({ status: "empty" })
          return null
        }

        const new_data = convertData(data)
        const numberIndices = getNumberIndices(Object.values(new_data[0]))
        const scatterPlotSettings = {
          'x-axis': numberIndices[0],
          'y-axis': numberIndices[1],
          'label': -1,
          'color': -1,
          'radius': -1
        }
        this.setState({ data: new_data,
                        header: Object.keys(new_data[0]),
                        numberIndices: numberIndices,
                        status: "done",
                        numResults: new_data.length,
                        settings: scatterPlotSettings
                      })
      })
  }

  setSettings = (settings) => {
    this.setState({ settings })
  }

  render() {
    return (
      <Grid>
        <PageHeader>Wikidata Visualization</PageHeader>
        <Row>
          <Col sm={4}>
            <Row>
              <Query
                onSubmit={this.getSPARQLResult}
                status={this.state.status}
                numResults={this.state.numResults}
              />
            </Row>
            <Row>
              <Settings
                header={this.state.header}
                numberIndices={this.state.numberIndices}
                settings={this.state.settings}
                onChange={this.setSettings}
              />
            </Row>
          </Col>
          <Col sm={8}>
            <Navs chart={this.state.chartName} handleChartSelect={this.handleChartSelect} />
            { this.state.chart === 1.1 &&
              <DataTable data={this.state.data} header={this.state.header} />
            }

            { this.state.chart > 1.1 &&
              <Chart
                data={this.state.data}
                header={this.state.header}
                settings={this.state.settings}
              />
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
