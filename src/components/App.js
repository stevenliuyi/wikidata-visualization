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
import Examples from './Examples'
import * as WikidataAPI from '../utils/api';
import { convertData } from '../utils/convertData';
import { getSettings } from '../utils/settings';

const chartNames = {
  1.1: 'Table',
  1.2: 'Scatter Chart',
  1.3: 'Bubble Chart'
}

class App extends Component {
  state = {
    data: [],
    header: [],
    status: "",
    numResults: 0,
    settings: {},
    settingsInfo: {},
    chart: 1.1,
    chartName: 'Table',
    editorFullScreen: false,
    exampleIndex: -1,
  }

  handleChartSelect = (selected) => {
    if (selected < 2) { // chart
      const [defaultSettings, settingsInfo] = getSettings(parseFloat(selected), this.state.data[0])
      this.setState({ chart: parseFloat(selected),
                      settings: defaultSettings,
                      settingsInfo: settingsInfo })
      this.setState({ chartName: chartNames[selected] })
    } else {
      this.setState({ chart: parseFloat(selected) })
    }
  }

  changeEditorSize = () => {
    if (!this.state.editorFullScreen) {
      this.setState({ editorFullScreen: true }) 
    } else {
      this.setState({ editorFullScreen: false })
    }
  }

  handleExampleSelect = (index) => {
    this.setState({ exampleIndex: index })
  }

  getSPARQLResult = (code) => {
    this.setState({
      status: "waiting",
      exampleIndex: -1
    })
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
        const new_chart = (this.state.chart < 2) ? this.state.chart : 1.1
        const [defaultSettings, settingsInfo] = getSettings(new_chart, new_data[0])

        this.setState({ data: new_data,
                        header: Object.keys(new_data[0]),
                        status: "done",
                        numResults: new_data.length,
                        settings: defaultSettings,
                        settingsInfo: settingsInfo,
                        chart: new_chart,
                        chartName: chartNames[new_chart]
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
          <Col sm={(this.state.editorFullScreen ? 12 : 4)}>
            <Row className='padding-5'>
              <Query
                onSubmit={this.getSPARQLResult}
                onChangeEditorSize={this.changeEditorSize}
                status={this.state.status}
                numResults={this.state.numResults}
                exampleIndex={this.state.exampleIndex}
              />
            </Row>
            { !this.state.editorFullScreen && 
              <Row className='padding-5'>
                <Settings
                  header={this.state.header}
                  settings={this.state.settings}
                  onChange={this.setSettings}
                  info={this.state.settingsInfo}
                />
              </Row>
            }
          </Col>
          { !this.state.editorFullScreen &&
            <Col sm={8}>
              <Navs
                charts={chartNames}
                currentChart={this.state.chartName}
                handleChartSelect={this.handleChartSelect} />
              { this.state.chart === 1.1 &&
                <DataTable data={this.state.data} header={this.state.header} />
              }

              { this.state.chart > 1.1 && this.state.chart < 2 &&
                <Chart
                  chartId={this.state.chart}
                  data={this.state.data}
                  header={this.state.header}
                  settings={this.state.settings}
                />
              }

              { this.state.chart === 2 && // examples
                <Examples onSelect={this.handleExampleSelect} />
              }
            </Col>
          }
        </Row>
      </Grid>
    );
  }
}

export default App;
