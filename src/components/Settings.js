import React, { Component } from 'react'
import { PanelGroup, Panel, FormControl } from 'react-bootstrap'
import {
  charts,
  moreSettingTitles,
  canvasSettingTitles,
  axisSettingTitles
} from '../utils/settings'
import SettingPanel from './SettingPanel'
import SettingToggle from './SettingToggle'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import ReactBootstrapRangeSlider from './ReactBootstrapRangeSlider'
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css'
import { colorSchemeNames, getColorScaleFromValues } from '../utils/scales'
import { mapSettings, mapProjections } from '../utils/maps'
import { map2Settings } from '../utils/maps2'
import { baseMapSettings, solarSystemSettings } from '../utils/basemap'
import { formats, timeFormats } from '../utils/format'
import * as d3 from 'd3'

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
      if (nextProps.chart === 1.01) {
        // Data Table
        this.setState({ panelKey: '2' })
      } else {
        this.setState({ panelKey: '1' })
      }
    }
  }

  componentDidUpdate() {
    // hack to fix react-bootstrap-slider tooltip position issue
    setTimeout(() => {
      //get tooltip nodes
      const nodes = d3.selectAll('.tooltip-main').nodes()
      if (nodes.length > 0) {
        // get actual widths of all tooltips
        const widths = nodes.map(node => node.getBoundingClientRect().width)
        // set tooltip margin-left
        d3
          .selectAll('.tooltip-main')
          .style('margin-left', (d, i) => `-${widths[i] / 2}px`)
      }
    }, 100)
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
          slideStop={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
          step={1}
          min={2}
          max={48}
        />
      )
    } else if (setting === 'radius') {
      return (
        <ReactBootstrapRangeSlider
          value={this.props.moreSettings.radius}
          slideStop={e =>
            this.props.onMoreSettingsChange({ radius: e.target.value })
          }
          step={1}
          min={1}
          max={150}
        />
      )
    } else if (setting === 'color') {
      // for color palette
      const values = [...Array(10).keys()].map(v => v / 9)
      const sampleColorScale = getColorScaleFromValues(
        values,
        this.props.moreSettings.color
      )
      const sampleColors = values.map(v => sampleColorScale(v))

      return (
        <div>
          <FormControl
            componentClass="select"
            value={this.props.moreSettings.color}
            onChange={e =>
              this.props.onMoreSettingsChange({ color: e.target.value })
            }
          >
            {colorSchemeNames.map(colorSchemeName => (
              <option value={colorSchemeName} key={colorSchemeName}>
                {colorSchemeName}
              </option>
            ))}
          </FormControl>
          {/* generating color palettte  */}
          <div className="color-palette">
            {sampleColors.map(color => (
              <div style={{ backgroundColor: color }} key={color} />
            ))}
          </div>
        </div>
      )
    } else if (setting === 'map' || setting === 'map2') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings[setting]}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
        >
          {Object.keys(setting === 'map' ? mapSettings : map2Settings).map(
            region => (
              <option value={region} key={region}>
                {region}
              </option>
            )
          )}
        </FormControl>
      )
    } else if (setting === 'projection') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings.projection}
          onChange={e =>
            this.props.onMoreSettingsChange({ projection: e.target.value })
          }
        >
          {mapProjections.map(proj => (
            <option value={proj.projection} key={proj.projection}>
              {proj.title}
            </option>
          ))}
        </FormControl>
      )
    } else if (setting === 'strength') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.strength}
          slideStop={e =>
            this.props.onMoreSettingsChange({ strength: e.target.value })
          }
          step={5}
          min={-300}
          max={0}
        />
      )
    } else if (setting === 'iterations') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.iterations}
          slideStop={e =>
            this.props.onMoreSettingsChange({ iterations: e.target.value })
          }
          step={1}
          min={1}
          max={150}
        />
      )
    } else if (setting === 'nodeWidth') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.nodeWidth}
          slideStop={e =>
            this.props.onMoreSettingsChange({ nodeWidth: e.target.value })
          }
          step={1}
          min={1}
          max={50}
        />
      )
    } else if (setting === 'nodePadding') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.nodePadding}
          slideStop={e =>
            this.props.onMoreSettingsChange({ nodePadding: e.target.value })
          }
          step={1}
          min={1}
          max={50}
        />
      )
    } else if (setting === 'padding') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.padding}
          slideStop={e =>
            this.props.onMoreSettingsChange({ padding: e.target.value })
          }
          step={1}
          min={0}
          max={50}
        />
      )
    } else if (setting === 'sortRow' || setting === 'sortColumn') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings[setting]}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
        >
          <option value="none" key="none">
            none
          </option>
          {header.map(h => (
            <option value={h} key={h}>
              {h}
            </option>
          ))}
        </FormControl>
      )
    } else if (setting === 'baseMap') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings[setting]}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
        >
          {Object.keys(baseMapSettings).map(map => (
            <option value={map} key={map}>
              {map}
            </option>
          ))}
        </FormControl>
      )
    } else if (setting === 'solarSystem') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings[setting]}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
        >
          {Object.keys(solarSystemSettings).map(map => (
            <option value={map} key={map}>
              {map}
            </option>
          ))}
        </FormControl>
      )
    } else if (
      setting === 'showCircles' ||
      setting === 'showMarkers' ||
      setting === 'reasonator' ||
      setting === 'showLegend'
    ) {
      return (
        <SettingToggle
          active={this.props.moreSettings[setting]}
          on="Show"
          off="Hide"
          onClick={state => {
            const newSetting = {}
            newSetting[setting] = state
            this.props.onMoreSettingsChange(newSetting)
          }}
        />
      )
    } else if (
      setting === 'ignoreCase' ||
      setting === 'regex' ||
      setting === 'numericRangeFilter' ||
      setting === 'timeRangeFilter'
    ) {
      return (
        <SettingToggle
          active={this.props.moreSettings[setting]}
          on="On"
          off="Off"
          onClick={state => {
            const newSetting = {}
            newSetting[setting] = state
            this.props.onMoreSettingsChange(newSetting)
          }}
        />
      )
    } else if (setting === 'delimiter') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings['delimiter']}
          onChange={e =>
            this.props.onMoreSettingsChange({ delimiter: e.target.value })
          }
        >
          <option value="[NONE]" key="none">
            none
          </option>
          <option value=" " key="space">
            space
          </option>
          <option value="," key="comma">
            comma (,)
          </option>
          <option value=";" key="semi-colon">
            semi-colon (;)
          </option>
          <option value="." key="dot">
            dot (.)
          </option>
          <option value="Chinese" key="Chinese">
            Chinese tokenizer
          </option>
          <option value="Japanese" key="Japanese">
            Japanese tokenizer
          </option>
        </FormControl>
      )
    } else if (setting === 'case') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings['case']}
          onChange={e =>
            this.props.onMoreSettingsChange({ case: e.target.value })
          }
        >
          <option value="default" key="default">
            default
          </option>
          <option value="lower case" key="lower case">
            lower case
          </option>
          <option value="upper case" key="upper case">
            upper case
          </option>
        </FormControl>
      )
    } else if (setting === 'sizeScale') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings['sizeScale']}
          onChange={e =>
            this.props.onMoreSettingsChange({ sizeScale: e.target.value })
          }
        >
          <option value="linear" key="linear">
            linear
          </option>
          <option value="log" key="log">
            log
          </option>
        </FormControl>
      )
    } else if (setting === 'fontSizes') {
      return (
        <ReactBootstrapRangeSlider
          value={this.props.moreSettings.fontSizes}
          slideStop={e =>
            this.props.onMoreSettingsChange({ fontSizes: e.target.value })
          }
          step={1}
          min={1}
          max={128}
        />
      )
    } else if (setting === 'width' || setting === 'height') {
      return (
        <ReactBootstrapSlider
          value={this.props.canvasSettings[setting]}
          slideStop={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onCanvasSettingsChange(newSetting)
          }}
          tooltip_position={setting === 'width' ? 'top' : 'bottom'}
          step={10}
          min={200}
          max={2048}
        />
      )
    } else if (setting === 'auto' || setting === 'border') {
      return (
        <SettingToggle
          active={this.props.canvasSettings[setting]}
          on="On"
          off="Off"
          onClick={state => {
            const newSetting = {}
            newSetting[setting] = state
            return this.props.onCanvasSettingsChange(newSetting)
          }}
        />
      )
    } else if (setting === 'legendScale') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings[setting]}
          slideStop={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
          step={0.1}
          min={0.1}
          max={3}
        />
      )
    } else if (setting === 'rotation') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings[setting]}
          slideStop={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
          step={1}
          min={0}
          max={90}
        />
      )
    } else if (setting === 'barType') {
      return (
        <FormControl
          id="bartype-select"
          componentClass="select"
          value={this.props.moreSettings['barType']}
          onChange={e =>
            this.props.onMoreSettingsChange({ barType: e.target.value })
          }
        >
          <option value="stacked" key="stacked">
            stacked
          </option>
          <option value="grouped" key="grouped">
            grouped
          </option>
        </FormControl>
      )
    } else if (setting === 'timelineType') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.moreSettings['timelineType']}
          onChange={e =>
            this.props.onMoreSettingsChange({ timelineType: e.target.value })
          }
        >
          <option value="separate" key="separate">
            separate
          </option>
          <option value="grouped" key="grouped">
            grouped
          </option>
        </FormControl>
      )
    } else if (setting === 'innerRadius') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.innerRadius}
          slideStop={e =>
            this.props.onMoreSettingsChange({ innerRadius: e.target.value })
          }
          step={0.05}
          min={0}
          max={1}
        />
      )
    } else if (
      setting === 'xformat' ||
      setting === 'yformat' ||
      setting === 'format'
    ) {
      return (
        <FormControl
          componentClass="select"
          value={this.props.axisSettings[setting]}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onAxisSettingsChange(newSetting)
          }}
        >
          {Object.keys(formats).map(format => (
            <option value={format} key={format}>
              {format}
            </option>
          ))}
        </FormControl>
      )
    } else if (
      setting === 'xprecision' ||
      setting === 'yprecision' ||
      setting === 'precision'
    ) {
      return (
        <ReactBootstrapSlider
          value={this.props.axisSettings[setting]}
          slideStop={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onAxisSettingsChange(newSetting)
          }}
          tooltip_position={setting === 'xprecision' ? 'top' : 'bottom'}
          step={1}
          min={0}
          max={10}
        />
      )
    } else if (setting === 'xtimeprecision' || setting === 'ytimeprecision') {
      return (
        <FormControl
          componentClass="select"
          value={this.props.axisSettings[setting]}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onAxisSettingsChange(newSetting)
          }}
        >
          {Object.keys(timeFormats).map(format => (
            <option value={format} key={format}>
              {format}
            </option>
          ))}
        </FormControl>
      )
    } else if (setting === 'xgridlines' || setting === 'ygridlines') {
      return (
        <SettingToggle
          active={this.props.axisSettings[setting]}
          on="On"
          off="Off"
          onClick={state => {
            const newSetting = {}
            newSetting[setting] = state
            return this.props.onAxisSettingsChange(newSetting)
          }}
        />
      )
    } else if (
      setting === 'xticks' ||
      setting === 'yticks' ||
      setting === 'ticks'
    ) {
      return (
        <ReactBootstrapSlider
          value={this.props.axisSettings[setting]}
          slideStop={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onAxisSettingsChange(newSetting)
          }}
          tooltip_position={setting === 'xticks' ? 'top' : 'bottom'}
          step={2}
          min={2}
          max={20}
        />
      )
    } else {
      return null
    }
  }

  render() {
    if (
      document.getElementsByClassName('info-text').length !== 0 &&
      document.getElementsByClassName('show-settings').length === 0
    )
      return null

    if (this.props.chart >= 2 || this.props.header.length === 0) return null

    const chartId = charts.map(chart => chart.id).indexOf(this.props.chart)

    const moreSettingsHeader =
      this.props.chart !== 1.01 ? 'Display options' : 'Options'

    // data options
    let chartSettingComponents = {}
    if (
      Array.isArray(this.props.info) &&
      Object.keys(this.props.settings).length > 0
    ) {
      this.props.info.forEach(setting => {
        if (setting.type === 'slider') {
          chartSettingComponents[setting.title] = (
            <ReactBootstrapSlider
              value={this.props.settings[setting.value]}
              slideStop={e => {
                let new_event = e
                new_event.target.name = setting.value
                this.onSettingsChange(new_event)
              }}
              {...setting.props}
            />
          )
        } else if (setting.value === 'y-axis-groups') {
          chartSettingComponents[setting.title] = (
            <div>
              {[...Array(this.props.settings.ngroups).keys()].map((_, idx) => (
                <FormControl
                  key={idx}
                  name={idx > 0 ? `${setting.value}${idx}` : setting.value}
                  componentClass="select"
                  value={this.props.settings[`${setting.value}${idx}`]}
                  style={{ marginBottom: '10px' }}
                  onChange={this.onSettingsChange}
                >
                  {Array.isArray(this.props.header) &&
                    setting.indices.map(index => (
                      <option value={index} key={index}>
                        {index === -1 ? 'none' : this.props.header[index]}
                      </option>
                    ))}
                </FormControl>
              ))}
            </div>
          )
        } else {
          chartSettingComponents[setting.title] = (
            <FormControl
              name={setting.value}
              componentClass="select"
              value={this.props.settings[setting.value]}
              onChange={this.onSettingsChange}
            >
              {Array.isArray(this.props.header) &&
                setting.indices.map(index => (
                  <option value={index} key={index}>
                    {index === -1 ? 'none' : this.props.header[index]}
                  </option>
                ))}
            </FormControl>
          )
        }
      })
    }

    // more options
    const chartMoreSettings = chartId >= 0 ? charts[chartId].moreSettings : null
    let chartMoreSettingComponents = {}
    if (Array.isArray(chartMoreSettings)) {
      chartMoreSettings.forEach(moreSetting => {
        if (
          !this.props.moreSettings.showLegend &&
          moreSetting.startsWith('legend')
        )
          return

        if (
          this.props.moreSettings.solarSystem !== 'Earth' &&
          moreSetting === 'baseMap'
        )
          return

        chartMoreSettingComponents[
          moreSettingTitles[moreSetting]
        ] = this.getMoreSetting(moreSetting, this.props.header)
      })
    }

    // axes options
    const chartAxisSettings = chartId >= 0 ? charts[chartId].axisSettings : null
    let chartAxisSettingComponents = {}
    if (Array.isArray(chartAxisSettings)) {
      chartAxisSettings.forEach(axisSetting => {
        if (
          this.props.dataTypes[this.props.settings['x-axis']] !== 'number' &&
          (axisSetting === 'xformat' || axisSetting === 'xprecision')
        )
          return

        if (
          this.props.dataTypes[this.props.settings['y-axis']] !== 'number' &&
          (axisSetting === 'yformat' || axisSetting === 'yprecision')
        )
          return

        if (
          this.props.dataTypes[this.props.settings['x-axis']] !== 'time' &&
          axisSetting === 'xtimeprecision'
        )
          return

        if (
          this.props.dataTypes[this.props.settings['y-axis']] !== 'time' &&
          axisSetting === 'ytimeprecision'
        )
          return

        chartAxisSettingComponents[
          axisSettingTitles[axisSetting]
        ] = this.getMoreSetting(axisSetting, this.props.header)
      })
    }

    // canvas options
    const chartCanvasSettings =
      chartId >= 0 ? charts[chartId].canvasSettings : null
    let chartCanvasSettingComponents = {}
    if (Array.isArray(chartCanvasSettings)) {
      chartCanvasSettings.forEach(canvasSetting => {
        if (this.props.canvasSettings.auto && canvasSetting === 'width') return

        chartCanvasSettingComponents[
          canvasSettingTitles[canvasSetting]
        ] = this.getMoreSetting(canvasSetting, this.props.header)
      })
    }

    return (
      <PanelGroup
        activeKey={this.state.panelKey}
        onSelect={this.handleSelect}
        accordion
      >
        {Array.isArray(this.props.info) &&
          Object.keys(this.props.settings).length > 0 && (
            <Panel header="Data options" eventKey="1" key="1">
              <SettingPanel settings={chartSettingComponents} />
            </Panel>
          )}
        {Array.isArray(chartMoreSettings) &&
          chartMoreSettings.length > 0 && (
            <Panel header={moreSettingsHeader} eventKey="2" key="2">
              <SettingPanel settings={chartMoreSettingComponents} />
            </Panel>
          )}
        {Array.isArray(chartAxisSettings) &&
          chartAxisSettings.length > 0 && (
            <Panel header="Axes options" eventKey="3" key="3">
              <SettingPanel settings={chartAxisSettingComponents} />
            </Panel>
          )}
        {Array.isArray(chartCanvasSettings) &&
          chartCanvasSettings.length > 0 && (
            <Panel header="Canvas options" eventKey="4" key="4">
              <SettingPanel settings={chartCanvasSettingComponents} />
            </Panel>
          )}
      </PanelGroup>
    )
  }
}

export default Settings
