import React, { Component } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import { Grid, Row, Col } from 'react-bootstrap'
import Query from './Query'
import Settings from './Settings'
import Chart from './Chart'
import DataTable from './DataTable'
import Navs from './Navs'
import Examples from './Examples'
import TopNavBar from './TopNavBar'
import * as WikidataAPI from '../utils/api'
import { convertData } from '../utils/convertData'
import { getChartNames, getSettings, moreSettings } from '../utils/settings'
import Measure from 'react-measure'
import ImageGallery from './Gallery'
import Promise from 'bluebird'

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
    editorWidth: null,
    exampleIndex: -1,
    chartNames: {},
    rowSelections: [],
    moreSettings: {},
    timingPromise: null
  }

  componentDidMount() {
    const chartNames = getChartNames()
    this.setState({ chartNames })

    Promise.config({
      cancellation: true // enable Promise cancellation
    })
  }

  handleChartSelect = (selected) => {
    if (selected === 1) { // chart in the top navbar is selected
      if (this.state.chart >= 2) {
        this.setState({ chart: 1.01, chartName: 'Table' })
      }
    } else if (selected < 2) { // chart
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
      this.setState({ editorFullScreen: true, exampleIndex: -1 }) 
    } else {
      this.setState({ editorFullScreen: false, examleIndex: -1 })
    }
  }

  handleExampleSelect = (index) => {
    this.setState({ exampleIndex: index })
  }

  handleMoreSettingsChange = (new_setting) => {
    this.setState(prevState => ({
      moreSettings: {
        ...prevState.moreSettings,
        ...new_setting
      }
    }))
  }

  updateRowSelections = (selection) => {
    this.setState({ rowSelections: selection.sort() })
  }

  getSPARQLResult = (code) => {
    this.setState({
      status: 'waiting',
      exampleIndex: -1
    })
    const query = `query=${encodeURIComponent(code)}`
    const timingPromise = new Promise((resolve, _, onCancel) => {
        const timer = setTimeout(() => resolve('timeout'), 60000)
        onCancel(() => clearTimeout(timer))
    })
    this.setState({ timingPromise })

    Promise.race([
      WikidataAPI.fetchSPARQLResult(query),
      timingPromise
    ])
      .then(data => {
        if (data === null) {
          this.setState({ status: 'error' })
          return null
        } else if (data === 'timeout') {
          this.setState({ status: 'timeout' })
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
          chartName: this.state.chartNames[new_chart],
          rowSelections: [...Array(new_data.length).keys()],
          moreSettings: moreSettings
        })
      })
      .finally(() => {
        if (timingPromise.isCancelled()) {
          this.setState({ status: 'cancelled' })
          return null
        }
      })
  }

  setSettings = (settings) => {
    this.setState({ settings })
  }

  render() {
    return (
      <div className='site'>
        <div className='site-content'>
          <TopNavBar handleChartSelect={this.handleChartSelect} />
          <Grid>
            <Row>
              <Col sm={(this.state.editorFullScreen ? 12 : 4)}>
                <Row className='padding-5'>
                  <Measure
                    bounds
                    onResize={(contentRect) => this.setState({ editorWidth: contentRect.bounds.width })}
                  >
                    {({ measureRef}) =>
                      <div ref={measureRef}>
                        <Query
                          onSubmit={this.getSPARQLResult}
                          onChangeEditorSize={this.changeEditorSize}
                          onCancel={() => this.state.timingPromise.cancel()}
                          status={this.state.status}
                          numResults={this.state.numResults}
                          exampleIndex={this.state.exampleIndex}
                          width={this.state.editorWidth}
                        />
                      </div>
                    }
                  </Measure>
                </Row>
                { !this.state.editorFullScreen && 
                <Row className='padding-5'>
                  <Settings
                    header={this.state.header}
                    settings={this.state.settings}
                    info={this.state.settingsInfo}
                    moreSettings={this.state.moreSettings}
                    chart={this.state.chart}
                    onChange={this.setSettings}
                    onMoreSettingsChange={this.handleMoreSettingsChange}
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
                    dataTypes={this.state.dataTypes}
                    selection={this.state.rowSelections}
                    updateSelection={this.updateRowSelections}
                    moreSettings={this.state.moreSettings}
                  />
                }

                { this.state.chart > 1.01 && this.state.chart < 2 && this.state.chart !== 1.12 &&
                  <Chart
                    chartId={this.state.chart}
                    data={this.state.data}
                    rowSelections={this.state.rowSelections}
                    header={this.state.header}
                    settings={this.state.settings}
                    moreSettings={this.state.moreSettings}
                  />
                }
                {
                  this.state.chart === 1.12 &&
                  <ImageGallery
                    data={this.state.data}
                    rowSelections={this.state.rowSelections}
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
        <footer className='footer text-muted'>Steven Liu&nbsp;&nbsp;2018</footer>
      </div>
    )
  }
}

export default App
