import React, { Component } from 'react'
import { PanelGroup, Panel, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap'
import { charts, moreSettingTitles } from '../utils/settings'
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import { colorSchemeNames, getColorScaleFromValues } from '../utils/scales'
import { mapSettings, mapProjections } from '../utils/maps'
import { map2Settings } from '../utils/maps2'

class Settings extends Component {

  state = {
    panelKey: '1'
  }

  componentWillMount() {
    this.onSettingsChange = this.onSettingsChange.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(panelKey) {
    this.setState({ panelKey })
  }

  onSettingsChange(event) {
    const settings = this.props.settings
    settings[event.target.name] = parseInt(event.target.value, 10)
    this.props.onChange(settings)
  }

  getMoreSetting(setting) {
    if (setting === 'fontSize' || setting === 'edgeFontSize') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings[setting]}
          slideStop={(e)=>{
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
          step={1}
          min={4}
          max={48} />
      )
    } else if (setting === 'radius') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.radius}
          slideStop={(e)=>this.props.onMoreSettingsChange({radius: e.target.value})}
          step={1}
          min={1}
          max={150} />
      )
    } else if (setting === 'color') {
      // for color palette
      const values = [...Array(10).keys()].map(v => v/9)
      const sampleColorScale = getColorScaleFromValues(values, this.props.moreSettings.color)
      const sampleColors = values.map(v => sampleColorScale(v))

      return (
        <div>
          <FormControl
            componentClass="select"
            value={this.props.moreSettings.color}
            onChange={(e)=>this.props.onMoreSettingsChange({color: e.target.value})}
          >
            {
              colorSchemeNames.map((colorSchemeName) => (
                <option value={colorSchemeName} key={colorSchemeName}>
                  { colorSchemeName }
                </option>
              ))
            }
          </FormControl>
          { /* generating color palettte  */ }
          <div className='color-palette'>
            {
              sampleColors.map(color => (
                <div style={{backgroundColor: color}} key={color} />
              ))
            }
          </div>
        </div>
      )
    } else if ( setting === 'map' || setting === 'map2') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings[setting]}
          onChange={(e)=>{
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
        >
          {
            Object.keys(((setting === 'map') ? mapSettings : map2Settings)).map(region => (
              <option value={region} key={region}>
                { region }
              </option>
            ))
          }
        </FormControl>
      )
    } else if ( setting === 'projection') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings.projection}
          onChange={(e)=>this.props.onMoreSettingsChange({projection: e.target.value})}
        >
          {
            mapProjections.map(proj => (
              <option value={proj.projection} key={proj.projection}>
                { proj.title }
              </option>
            ))
          }
        </FormControl>
      )
    } else if (setting === 'strength') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.strength}
          slideStop={(e)=>this.props.onMoreSettingsChange({strength: e.target.value})}
          step={5}
          min={-300}
          max={0} />
      )
    } else if (setting === 'iterations') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.iterations}
          slideStop={(e)=>this.props.onMoreSettingsChange({iterations: e.target.value})}
          step={1}
          min={1}
          max={150} />
      )
    } else {
      return null
    }
  }

  render() {
    const chartId = charts.map(chart => chart.id).indexOf(this.props.chart)
    const chartMoreSettings = (chartId >= 0) ? charts[chartId].moreSettings : null

    return (
      <PanelGroup activeKey={this.state.panelKey} onSelect={this.handleSelect} accordion>
        {
          Array.isArray(this.props.info) && (Object.keys(this.props.settings).length > 0) &&
              <Panel header='Data options' eventKey='1' key='1'>
                <Form horizontal>
                  { // data options
                    this.props.info.map( (setting, index) => {
                      return (
                        <FormGroup key={index}>
                          <Col componentClass={ControlLabel} sm={3}>{setting.title}</Col>
                          <Col sm={9}><FormControl
                            name={setting.value}
                            componentClass="select"
                            value={this.props.settings[setting.value]}
                            onChange={this.onSettingsChange}>
                            {
                              Array.isArray(this.props.header) &&
                          setting.indices.map((index) => (
                            <option value={index} key={index}>
                              {(index === -1) ? 'none' : this.props.header[index]}
                            </option>
                          ))
                            }
                          </FormControl></Col>
                        </FormGroup>
                      )
                    })
                  }
                </Form>
              </Panel>
        }
        { Array.isArray(chartMoreSettings) && chartMoreSettings.length > 0 &&
            <Panel header='More options' eventKey='2' key='2'>
              <Form horizontal>
                { // more options
                  chartMoreSettings.map(moreSetting => (
                    <FormGroup key={moreSetting}>
                      <Col componentClass={ControlLabel} sm={3}>{moreSettingTitles[moreSetting]}</Col>
                      <Col sm={9}>
                        { this.getMoreSetting(moreSetting) }
                      </Col>
                    </FormGroup>
                  ))
                }
              </Form>
            </Panel>
        }
      </PanelGroup>
    )
  }
}

export default Settings
