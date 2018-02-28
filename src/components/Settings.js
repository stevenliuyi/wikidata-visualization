import React, { Component } from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'
import {
  charts,
  moreSettingTitles,
  canvasSettingTitles,
  axisSettingTitles
} from '../utils/settings'
import SettingPanel from './SettingPanel'
import SettingToggle from './SettingToggle'
import Select2 from 'react-select2-wrapper'
import 'react-select2-wrapper/css/select2.min.css'
import 'select2-bootstrap-theme/dist/select2-bootstrap.min.css'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import ReactBootstrapRangeSlider from './ReactBootstrapRangeSlider'
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css'
import { colorSchemeNames, getColorScaleFromValues } from '../utils/scales'
import { mapSettings, mapProjections } from '../utils/maps'
import { map2Settings } from '../utils/maps2'
import { baseMapSettings, solarSystemSettings } from '../utils/basemap'
import { formats, timeFormats } from '../utils/format'
import * as d3 from 'd3'
import $ from 'jquery'
import ReactDOMServer from 'react-dom/server'
import 'flag-icon-css/css/flag-icon.min.css'

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
          value={parseInt(this.props.moreSettings[setting], 10)}
          slideStop={e => {
            const newSetting = {}
            newSetting[setting] = `${e.target.value}pt`
            return this.props.onMoreSettingsChange(newSetting)
          }}
          step={1}
          min={2}
          max={48}
          formatter={v => `${v}pt`}
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

      const sampleColorTemplate = (colors, withText = true) => {
        if (!colorSchemeNames.includes(colors.text)) return ''
        const sampleColorScale = getColorScaleFromValues(values, colors.text)
        const sampleColors = values.map(v => sampleColorScale(v))
        // generating color pallette
        let sampleColorsElement = (
          <div className="color-palette">
            {sampleColors.map(color => (
              <div style={{ backgroundColor: color }} key={color} />
            ))}
          </div>
        )
        if (withText)
          sampleColorsElement = (
            <div style={{ height: '36px' }}>
              <div className="color-palette-text">{colors.text}</div>
              {sampleColorsElement}
            </div>
          )
        const sampleColorsString = ReactDOMServer.renderToString(
          sampleColorsElement
        )
        return $(sampleColorsString)
      }

      return (
        <div>
          <Select2
            value={this.props.moreSettings.color}
            data={colorSchemeNames}
            onChange={e =>
              this.props.onMoreSettingsChange({ color: e.target.value })
            }
            options={{
              templateResult: colors => sampleColorTemplate(colors),
              templateSelection: colors => sampleColorTemplate(colors, false),
              width: '100%',
              theme: 'bootstrap'
            }}
          />
        </div>
      )
    } else if (setting === 'map' || setting === 'map2') {
      const mapsetting = setting === 'map' ? mapSettings : map2Settings
      const maps = Object.keys(mapsetting)
      let world = [],
        continents = [],
        countries = []

      maps.forEach(m => {
        if (m.startsWith('World')) {
          world.push(m)
        } else if (
          [
            'Africa',
            'Asia',
            'Europe',
            'North America',
            'Oceania',
            'South America'
          ].includes(m)
        ) {
          continents.push(m)
        } else {
          countries.push(m)
        }
      })

      const regionTemplate = region => {
        if (mapsetting[region.text] == null) return region.text
        if (mapsetting[region.text].code == null) {
          return region.text
        } else {
          // add country flag
          return $(
            `<span><span class='flag-icon flag-icon-${
              mapsetting[region.text].code
            }' /> ${region.text}</span>`
          )
        }
      }

      return (
        <Select2
          value={this.props.moreSettings[setting]}
          data={[
            {
              text: 'world',
              children: world
            },
            {
              text: 'continents',
              children: continents
            },
            {
              text: 'countries & regions',
              children: countries
            }
          ].filter(r => r.children.length > 0)}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
          options={{
            templateResult: region => regionTemplate(region),
            templateSelection: region => regionTemplate(region),
            width: '100%',
            theme: 'bootstrap'
          }}
        />
      )
    } else if (setting === 'projection') {
      const projections = mapProjections.map(proj => proj.projection)
      const titles = mapProjections.map(proj => proj.title)
      const projectionRenderText = projection =>
        titles[projections.indexOf(projection.text)]
      return (
        <Select2
          value={this.props.moreSettings.projection}
          data={projections}
          onChange={e =>
            this.props.onMoreSettingsChange({ projection: e.target.value })
          }
          options={{
            minimumResultsForSearch: -1,
            templateResult: projectionRenderText,
            templateSelection: projectionRenderText,
            width: '100%',
            theme: 'bootstrap'
          }}
        />
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
          formatter={v => `${v} steps`}
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
    } else if (setting === 'padAngle') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.padAngle}
          slideStop={e =>
            this.props.onMoreSettingsChange({ padAngle: e.target.value })
          }
          step={1}
          min={0}
          max={50}
          formatter={v => `${v}% outer radius`}
        />
      )
    } else if (setting === 'sortRow' || setting === 'sortColumn') {
      return (
        <Select2
          value={this.props.moreSettings[setting]}
          data={['none', ...header]}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
          options={{
            minimumResultsForSearch: -1,
            width: '100%',
            theme: 'bootstrap'
          }}
        />
      )
    } else if (setting === 'baseMap') {
      return (
        <Select2
          value={this.props.moreSettings[setting]}
          data={Object.keys(baseMapSettings)}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
          options={{
            width: '100%',
            theme: 'bootstrap'
          }}
        />
      )
    } else if (setting === 'solarSystem') {
      return (
        <Select2
          value={this.props.moreSettings[setting]}
          data={Object.keys(solarSystemSettings)}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onMoreSettingsChange(newSetting)
          }}
          options={{
            width: '100%',
            theme: 'bootstrap'
          }}
        />
      )
    } else if (setting === 'mapResolution') {
      return (
        <SettingToggle
          active={this.props.moreSettings[setting]}
          on="High"
          off="Low"
          onClick={state => {
            const newSetting = {}
            newSetting[setting] = state
            this.props.onMoreSettingsChange(newSetting)
          }}
        />
      )
    } else if (
      setting === 'showCircles' ||
      setting === 'showMarkers' ||
      setting === 'reasonator' ||
      setting === 'showLegend' ||
      setting === 'showArrows' ||
      setting === 'showLabels'
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
    } else if (setting === 'lineType') {
      return (
        <Select2
          value={this.props.moreSettings['lineType']}
          data={['geodesic', 'straight line']}
          onChange={e =>
            this.props.onMoreSettingsChange({ lineType: e.target.value })
          }
          options={{
            minimumResultsForSearch: -1,
            width: '100%',
            theme: 'bootstrap'
          }}
        />
      )
    } else if (setting === 'lineWidth') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.lineWidth}
          slideStop={e =>
            this.props.onMoreSettingsChange({ lineWidth: e.target.value })
          }
          step={1}
          min={1}
          max={10}
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
      const delimiterTexts = {
        '[NONE]': 'none',
        ' ': 'space',
        ',': 'comma (,)',
        ';': 'semicolon (;)',
        '.': 'dot (.)',
        Chinese: 'Chinese tokenizer',
        Japanese: 'Japanese tokenizer'
      }
      return (
        <Select2
          value={this.props.moreSettings['delimiter']}
          data={['[NONE]', ' ', ',', ';', '.', 'Chinese', 'Japanese']}
          onChange={e =>
            this.props.onMoreSettingsChange({ delimiter: e.target.value })
          }
          options={{
            minimumResultsForSearch: -1,
            templateResult: d => delimiterTexts[d.text],
            templateSelection: d => delimiterTexts[d.text],
            width: '100%',
            theme: 'bootstrap'
          }}
        />
      )
    } else if (setting === 'case') {
      return (
        <Select2
          value={this.props.moreSettings['case']}
          data={['default', 'lower case', 'upper case']}
          onChange={e =>
            this.props.onMoreSettingsChange({ case: e.target.value })
          }
          options={{
            minimumResultsForSearch: -1,
            width: '100%',
            theme: 'bootstrap'
          }}
        />
      )
    } else if (setting === 'sizeScale') {
      return (
        <Select2
          value={this.props.moreSettings['sizeScale']}
          data={['linear', 'log']}
          onChange={e =>
            this.props.onMoreSettingsChange({ sizeScale: e.target.value })
          }
          options={{
            minimumResultsForSearch: -1,
            width: '100%',
            theme: 'bootstrap'
          }}
        />
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
          formatter={v => `× ${v}`}
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
          formatter={v => `${v}°`}
        />
      )
    } else if (setting === 'barType') {
      return (
        <div id="bartype-select">
          <Select2
            value={this.props.moreSettings['barType']}
            data={['stacked', '100% stacked', 'grouped']}
            onChange={e =>
              this.props.onMoreSettingsChange({ barType: e.target.value })
            }
            options={{
              minimumResultsForSearch: -1,
              width: '100%',
              theme: 'bootstrap'
            }}
          />
        </div>
      )
    } else if (setting === 'timelineType') {
      return (
        <Select2
          value={this.props.moreSettings['timelineType']}
          data={['separated', 'grouped']}
          onChange={e =>
            this.props.onMoreSettingsChange({ timelineType: e.target.value })
          }
          options={{
            minimumResultsForSearch: -1,
            width: '100%',
            theme: 'bootstrap'
          }}
        />
      )
    } else if (setting === 'outerRadius') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.outerRadius}
          slideStop={e =>
            this.props.onMoreSettingsChange({ outerRadius: e.target.value })
          }
          step={1}
          min={2}
          max={100}
        />
      )
    } else if (setting === 'innerRadius') {
      return (
        <ReactBootstrapSlider
          value={this.props.moreSettings.innerRadius}
          slideStop={e =>
            this.props.onMoreSettingsChange({ innerRadius: e.target.value })
          }
          step={5}
          min={0}
          max={100}
          formatter={v => `${v}% outer radius`}
        />
      )
    } else if (
      setting === 'xformat' ||
      setting === 'yformat' ||
      setting === 'format'
    ) {
      return (
        <Select2
          value={this.props.axisSettings[setting]}
          data={Object.keys(formats)}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onAxisSettingsChange(newSetting)
          }}
          options={{
            minimumResultsForSearch: -1,
            width: '100%',
            theme: 'bootstrap'
          }}
        />
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
        <Select2
          value={this.props.axisSettings[setting]}
          data={Object.keys(timeFormats)}
          onChange={e => {
            const newSetting = {}
            newSetting[setting] = e.target.value
            return this.props.onAxisSettingsChange(newSetting)
          }}
          options={{
            minimumResultsForSearch: -1,
            width: '100%',
            theme: 'bootstrap'
          }}
        />
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
    } else if (setting === 'numOfColumns') {
      return (
        <ReactBootstrapRangeSlider
          value={this.props.moreSettings.numOfColumns}
          slideStop={e =>
            this.props.onMoreSettingsChange({ numOfColumns: e.target.value })
          }
          step={1}
          min={1}
          max={8}
          formatter={v => (v === 1 ? 'auto' : v)}
        />
      )
    } else if (setting === 'effect') {
      return (
        <Select2
          value={this.props.moreSettings['effect']}
          data={['no effect', 'grayscale', 'sepia', 'invert']}
          onChange={e =>
            this.props.onMoreSettingsChange({ effect: e.target.value })
          }
          options={{
            minimumResultsForSearch: -1,
            width: '100%',
            theme: 'bootstrap'
          }}
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
                <div style={{ marginBottom: '10px' }}>
                  <Select2
                    value={
                      this.props.settings[
                        idx > 0 ? `${setting.value}${idx}` : setting.value
                      ]
                    }
                    data={setting.indices}
                    onChange={e => {
                      let new_event = e
                      new_event.target.name =
                        idx > 0 ? `${setting.value}${idx}` : setting.value
                      this.onSettingsChange(new_event)
                    }}
                    options={{
                      minimumResultsForSearch: -1,
                      templateResult: index =>
                        index.text === '-1'
                          ? 'none'
                          : this.props.header[index.text],
                      templateSelection: index =>
                        index.text === '-1'
                          ? 'none'
                          : this.props.header[index.text],
                      width: '100%',
                      theme: 'bootstrap'
                    }}
                  />
                </div>
              ))}
            </div>
          )
        } else {
          chartSettingComponents[setting.title] = (
            <Select2
              value={this.props.settings[setting.value]}
              data={setting.indices}
              onChange={e => {
                let new_event = e
                new_event.target.name = setting.value
                this.onSettingsChange(new_event)
              }}
              options={{
                minimumResultsForSearch: -1,
                templateResult: index =>
                  index.text === '-1' ? 'none' : this.props.header[index.text],
                templateSelection: index =>
                  index.text === '-1' ? 'none' : this.props.header[index.text],
                width: '100%',
                theme: 'bootstrap'
              }}
            />
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

        if (moreSetting === 'mapResolution') {
          if (this.props.moreSettings.solarSystem === 'Earth') return
          if (
            solarSystemSettings[this.props.moreSettings.solarSystem]
              .lowres_filename == null
          )
            return
        }

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
        const x_label = this.props.dataTypes[this.props.settings['x-axis']]
        const y_label = this.props.dataTypes[this.props.settings['y-axis']]

        if (
          x_label !== 'number' &&
          this.props.chart === 1.02 &&
          (axisSetting === 'xformat' || axisSetting === 'xprecision')
        )
          return

        if (
          y_label !== 'number' &&
          this.props.chart === 1.02 &&
          (axisSetting === 'yformat' || axisSetting === 'yprecision')
        )
          return

        if (x_label !== 'time' && axisSetting === 'xtimeprecision') return

        if (y_label !== 'time' && axisSetting === 'ytimeprecision') return

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
