import React, { Component } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import { Grid, Row, Col, Navbar, Nav, NavItem } from 'react-bootstrap'
import Query from './Query'
import Settings from './Settings'
import Chart from './Chart'
import DataTable from './DataTable'
import Navs from './Navs'
import Examples from './Examples'
import * as WikidataAPI from '../utils/api'
import { convertData } from '../utils/convertData'
import { getChartNames, getSettings } from '../utils/settings'

class App extends Component {
  state = {
    data: [],
    header: [],
    dataTypes: [],
    status: '',
    numResults: 0,
    settings: {},
    settingsInfo: {},
    chart: 1.01,
    chartName: 'Table',
    editorFullScreen: false,
    exampleIndex: -1,
    chartNames: {}
  }

  componentDidMount() {
    const chartNames = getChartNames()
    this.setState({ chartNames })
  }

  handleChartSelect = (selected) => {
    if (selected < 2) { // chart
      const [defaultSettings, settingsInfo] = getSettings(parseFloat(selected),
        this.state.header,
        this.state.data,
        this.state.dataTypes)
      this.setState({ chart: parseFloat(selected),
        settings: defaultSettings,
        settingsInfo: settingsInfo })
      this.setState({ chartName: this.state.chartNames[selected] })
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
      status: 'waiting',
      exampleIndex: -1
    })
    const query = `query=${encodeURIComponent(code)}`
    WikidataAPI.fetchSPARQLResult(query)
      .then(data => {
        if (data === null) {
          this.setState({ status: 'error' })
          return null
        } else if (data.results.bindings.length === 0) {
          // empty result received
          this.setState({ status: 'empty' })
          return null
        }

        const header = data.head.vars
        const [new_data, data_types] = convertData(header, data.results.bindings)
        const new_chart = (this.state.chart < 2) ? this.state.chart : 1.01
        const [defaultSettings, settingsInfo] = getSettings(new_chart,
          header,
          new_data,
          data_types)

        this.setState({ data: new_data,
          header: header,
          dataTypes: data_types,
          status: 'done',
          numResults: new_data.length,
          settings: defaultSettings,
          settingsInfo: settingsInfo,
          chart: new_chart,
          chartName: this.state.chartNames[new_chart]
        })
      })
  }

  setSettings = (settings) => {
    this.setState({ settings })
  }

  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header><Navbar.Brand>Wikidata Visualization</Navbar.Brand></Navbar.Header>
          <Nav>
            <NavItem eventKey={1} onSelect={() => this.handleChartSelect(1)}>Charts</NavItem>
            <NavItem eventKey={2} onSelect={() => this.handleChartSelect(2)}>Query Examples</NavItem>
          </Nav>
        </Navbar>
        <Grid>
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
                { this.state.chart < 2 &&
                  <Navs
                    currentChartId={this.state.chart}
                    handleChartSelect={this.handleChartSelect} />
                }
                { this.state.chart === 1.01 &&
                  <DataTable
                    data={this.state.data}
                    header={this.state.header}
                    dataTypes={this.state.dataTypes} />
                }

                { this.state.chart > 1.01 && this.state.chart < 2 &&
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
      </div>
    )
  }
}

export default App
