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
    editorFullScreen: false
  }

  handleChartSelect = (selected) => {
    const [defaultSettings, settingsInfo] = getSettings(parseFloat(selected), this.state.data[0])
    this.setState({ chart: parseFloat(selected),
                    settings: defaultSettings,
                    settingsInfo: settingsInfo })
    if (selected < 2) this.setState({ chartName: chartNames[selected] })
  }

  changeEditorSize = () => {
    if (!this.state.editorFullScreen) {
      this.setState({ editorFullScreen: true }) 
    } else {
      this.setState({ editorFullScreen: false })
    }
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
        const [defaultSettings, settingsInfo] = getSettings(this.state.chart, new_data[0])

        this.setState({ data: new_data,
                        header: Object.keys(new_data[0]),
                        status: "done",
                        numResults: new_data.length,
                        settings: defaultSettings,
                        settingsInfo: settingsInfo
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

              { this.state.chart > 1.1 &&
                <Chart
                  chartId={this.state.chart}
                  data={this.state.data}
                  header={this.state.header}
                  settings={this.state.settings}
                />
              }
            </Col>
          }
        </Row>
      </Grid>
    );
  }
}

export default App;
