import React, { Component } from 'react'
import { PanelGroup, Panel, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap'
import { charts, moreSettingTitles, canvasSettingTitles } from '../utils/settings'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css'
import Toggle from 'react-bootstrap-toggle'
import 'react-bootstrap-toggle/dist/bootstrap2-toggle.css'
import { colorSchemeNames, getColorScaleFromValues } from '../utils/scales'
import { mapSettings, mapProjections } from '../utils/maps'
import { map2Settings } from '../utils/maps2'
import { baseMapSettings } from '../utils/basemap'

class Settings extends Component {

  state = {
    panelKey: '1'
  }

  componentWillMount() {
    this.onSettingsChange = this.onSettingsChange.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // set active panel
    if (nextProps.chart !== this.props.chart) {
      if (nextProps.chart === 1.01) { // Data Table
        this.setState({ panelKey: '2' })
      } else {
        this.setState({ panelKey: '1' })
      }
    }
  }

  handleSelect(panelKey) {
    this.setState({ panelKey })
  }

  onSettingsChange(event) {
    const settings = this.props.settings
    settings[event.target.name] = parseInt(event.target.value, 10)
    this.props.onChange(settings)
  }

  getMoreSetting(setting, header) {
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
    } else if (setting === 'nodeWidth') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.nodeWidth}
          slideStop={(e)=>this.props.onMoreSettingsChange({nodeWidth: e.target.value})}
          step={1}
          min={1}
          max={50} />
      )
    } else if (setting === 'nodePadding') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.nodePadding}
          slideStop={(e)=>this.props.onMoreSettingsChange({nodePadding: e.target.value})}
          step={1}
          min={1}
          max={50} />
      )
    } else if ( setting === 'sortRow' || setting === 'sortColumn' ) {
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
          <option value='none' key='none'>none</option>
          {
            header.map(h => (
              <option value={h} key={h}>{ h }</option>
            ))
          }
        </FormControl>
      )
    } else if ( setting === 'baseMap' ) {
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
            Object.keys(baseMapSettings).map(map => (
              <option value={map} key={map}>{ map }</option>
            ))
          }
        </FormControl>
      )
    } else if (setting === 'showCircles' || setting === 'showMarkers' || setting === 'reasonator') {
      return (
        <Toggle
          active={this.props.moreSettings[setting]}
          on='Show'
          off='Hide'
          size='sm'
          height={30}
          width='100%'
          onstyle='default'
          offstyle='default'
          handlestyle='primary'
          onClick={(state)=>{
            const newSetting = {}
            newSetting[setting] = state
            this.props.onMoreSettingsChange(newSetting)
          }}
        />
      )
    } else if (setting === 'ignoreCase' || setting === 'regex' || setting === 'numericRangeFilter') {
      return (
        <Toggle
          active={this.props.moreSettings[setting]}
          on='On'
          off='Off'
          size='sm'
          height={30}
          width='100%'
          onstyle='default'
          offstyle='default'
          handlestyle='primary'
          onClick={(state)=>{
            const newSetting = {}
            newSetting[setting] = state
            this.props.onMoreSettingsChange(newSetting)
          }}
        />
      )
    } else if ( setting === 'delimiter') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings['delimiter']}
          onChange={(e)=>this.props.onMoreSettingsChange({delimiter: e.target.value})}
        >
           <option value='[NONE]' key='none'>none</option>
           <option value=' ' key='space'>space</option>
           <option value=',' key='comma'>,</option>
           <option value=';' key='semi-colon'>;</option>
           <option value='.' key='dot'>.</option>
        </FormControl>
      )
    } else if (setting === 'case') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings['case']}
          onChange={(e)=>this.props.onMoreSettingsChange({case: e.target.value})}
        >
           <option value='default' key='default'>default</option>
           <option value='lower case' key='lower case'>lower case</option>
           <option value='upper case' key='upper case'>upper case</option>
        </FormControl>
      )
    } else if (setting === 'sizeScale') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings['sizeScale']}
          onChange={(e)=>this.props.onMoreSettingsChange({sizeScale: e.target.value})}
        >
           <option value='linear' key='linear'>linear</option>
           <option value='log' key='log'>log</option>
        </FormControl>
      )
    } else if (setting === 'fontSizes') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.fontSizes}
          slideStop={(e)=>this.props.onMoreSettingsChange({fontSizes: e.target.value})}
          step={1}
          min={1}
          max={128} />
      )
    } else if (setting === 'width' || setting === 'height') {
      return (
        <ReactBootstrapSlider
          value={this.props.canvasSettings[setting]}
          slideStop={(e)=>{
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onCanvasSettingsChange(newSetting)
          }}
          tooltip_position={setting==='width' ? 'top' : 'bottom'}
          step={10}
          min={200}
          max={2048} />
      )
    } else if (setting === 'auto' || setting === 'border') {
      return (
        <Toggle
          active={this.props.canvasSettings[setting]}
          on='On'
          off='Off'
          size='sm'
          height={30}
          width='100%'
          onstyle='default'
          offstyle='default'
          handlestyle='primary'
          onClick={(state)=>{
            const newSetting = {}
            newSetting[setting] = state
            return this.props.onCanvasSettingsChange(newSetting)
          }}
        />
      )
    } else {
      return null
    }
  }

  render() {
    const chartId = charts.map(chart => chart.id).indexOf(this.props.chart)
    const chartMoreSettings = (chartId >= 0) ? charts[chartId].moreSettings : null
    const chartCanvasSettings = (chartId >= 0) ? charts[chartId].canvasSettings : null

    if (this.props.chart >= 2 || this.props.header.length === 0) return null 

    const moreSettingsHeader = (this.props.chart !== 1.01) ? 'Display options' : 'Options'

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
                          <Col componentClass={ControlLabel} sm={4}>{setting.title}</Col>
                          <Col sm={8}><FormControl
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
            <Panel header={moreSettingsHeader} eventKey='2' key='2'>
              <Form horizontal>
                { // more options
                  chartMoreSettings.map(moreSetting => (
                    <FormGroup key={moreSetting}>
                      <Col componentClass={ControlLabel} sm={4}>{moreSettingTitles[moreSetting]}</Col>
                      <Col sm={8}>
                        { this.getMoreSetting(moreSetting, this.props.header) }
                      </Col>
                    </FormGroup>
                  ))
                }
              </Form>
            </Panel>
        }
        { Array.isArray(chartCanvasSettings) && chartCanvasSettings.length > 0 &&
            <Panel header='Canvas options' eventKey='3' key='3'>
              <Form horizontal>
                { // canvas options
                  chartCanvasSettings.map(canvasSetting => {
                    if (this.props.canvasSettings.auto && canvasSetting === 'width') return null

                    return (
                      <FormGroup key={canvasSetting}>
                        <Col componentClass={ControlLabel} sm={4}>{canvasSettingTitles[canvasSetting]}</Col>
                        <Col sm={8}>
                          { this.getMoreSetting(canvasSetting, this.props.header) }
                        </Col>
                      </FormGroup>
                    )
                  })
                }
              </Form>
            </Panel>
        }
      </PanelGroup>
    )
  }
}

export default Settings
