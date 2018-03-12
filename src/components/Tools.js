import React, { Component } from 'react'
import MdFileDownload from 'react-icons/lib/md/file-download'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdContentCopy from 'react-icons/lib/md/content-copy'
import MdRefresh from 'react-icons/lib/md/refresh'
import MdCropFree from 'react-icons/lib/md/crop-free'
import MdInfo from 'react-icons/lib/md/info'
import * as d3 from 'd3'
import saveSvgAsPng from 'save-svg-as-png'
import {
  Modal,
  Button,
  Form,
  FormGroup,
  FormControl,
  InputGroup,
  Col,
  ControlLabel,
  DropdownButton,
  MenuItem,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css'
import GitHub from 'github-api'
import { getGooglURL } from '../utils/api'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { baseMapSettings, solarSystemSettings } from '../utils/basemap'
import { ClipLoader } from 'react-spinners'
import { mapSettings } from '../utils/maps'
import { map2Settings } from '../utils/maps2'

const iconSize = 32
class Tools extends Component {
  state = {
    show: false,
    mode: 'download',
    format: '.svg',
    scale: 1,
    filename: '',
    gistUrl: '',
    rawGitUrl: '',
    tinyUrl: '',
    copyMessage: 'copy',
    started: false
  }

  getSvgNode = () => {
    const svgNode = d3
      .select('#chart')
      .select('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .node()

    return svgNode
  }

  getStringFromNode = node => {
    let svgString = node.outerHTML
    // fix Safari NS namespace prefix issue
    svgString = svgString.replace(/NS\d+:href/gi, 'xlink:href')
    return svgString
  }

  getImageURL = () => {
    this.setState({ started: true })
    const gh = new GitHub()
    let gist = gh.getGist()
    let data = {
      public: true,
      files: {}
    }
    const filename = `${this.state.filename}.svg`
    data.files[filename] = {
      content: this.getStringFromNode(this.getSvgNode())
    }

    gist.create(data).then(({ data }) => {
      const createdGist = data
      const gistUrl = createdGist.html_url
      const hash = gistUrl.match(/[^/]+$/)[0]
      const rawGitUrl = `https://gistcdn.githack.com/anonymous/${hash}/raw/${filename}`
      this.setState({
        gistUrl,
        rawGitUrl
      })
      getGooglURL(rawGitUrl)
        .then(tinyUrl => this.setState({ tinyUrl }))
        .then(() => this.setState({ started: false }))
    })
  }

  saveSVG = () => {
    const svgBlob = new Blob([this.getStringFromNode(this.getSvgNode())], {
      type: 'image/svg+xml;charset=utf-8'
    })
    const svgUrl = URL.createObjectURL(svgBlob)

    const link = document.createElement('a')
    link.href = svgUrl
    link.download = `${this.state.filename}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  savePNG = () => {
    saveSvgAsPng.saveSvgAsPng(this.getSvgNode(), `${this.state.filename}.png`, {
      scale: this.state.scale
    })
  }

  saveImage = () => {
    if (this.state.format === '.svg') {
      this.saveSVG()
    } else {
      this.savePNG()
    }
  }

  render() {
    return (
      <div style={{ marginRight: '10px' }}>
        {this.props.chartId === 1.17 &&
          this.props.moreSettings.delimiter === 'Chinese' && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="chinese-segement-info">
                  Chinese word segementation powered by segmentit
                </Tooltip>
              }
            >
              <MdInfo
                size={iconSize}
                onClick={() =>
                  window.open(
                    'https://github.com/linonetwo/segmentit',
                    '_blank'
                  )
                }
                className="clickable-icon toolbar-icon pull-right"
              />
            </OverlayTrigger>
          )}

        {this.props.chartId === 1.17 &&
          this.props.moreSettings.delimiter === 'Japanese' && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="japanese-segement-info">
                  Japanese word segementation powered by TinySegmenter
                </Tooltip>
              }
            >
              <MdInfo
                size={iconSize}
                onClick={() =>
                  window.open(
                    'https://github.com/leungwensen/tiny-segmenter',
                    '_blank'
                  )
                }
                className="clickable-icon toolbar-icon pull-right"
              />
            </OverlayTrigger>
          )}

        {this.props.chartId === 1.16 &&
          this.props.moreSettings.solarSystem === 'Earth' && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="leaflet-info">
                  <div
                    align="right"
                    dangerouslySetInnerHTML={{
                      __html:
                        baseMapSettings[this.props.moreSettings.baseMap]
                          .attribution + '<br />powered by <b>Leaflet</b>'
                    }}
                  />
                </Tooltip>
              }
            >
              <MdInfo
                size={iconSize}
                onClick={() =>
                  window.open(
                    baseMapSettings[this.props.moreSettings.baseMap]
                      .attribution_url,
                    '_blank'
                  )
                }
                className="clickable-icon toolbar-icon pull-right"
              />
            </OverlayTrigger>
          )}

        {this.props.chartId === 1.16 &&
          this.props.moreSettings.solarSystem !== 'Earth' && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="leaflet-info">
                  <div
                    align="right"
                    dangerouslySetInnerHTML={{
                      __html:
                        solarSystemSettings[this.props.moreSettings.solarSystem]
                          .attribution + '<br />powered by <b>Leaflet</b>'
                    }}
                  />
                </Tooltip>
              }
            >
              <MdInfo
                size={iconSize}
                onClick={() =>
                  window.open(
                    solarSystemSettings[this.props.moreSettings.solarSystem]
                      .attribution_url,
                    '_blank'
                  )
                }
                className="clickable-icon toolbar-icon pull-right"
              />
            </OverlayTrigger>
          )}

        {this.props.chartId !== 1.16 && (
          <div>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="get-image-url">get SVG URL</Tooltip>}
            >
              <MdInsertLink
                size={iconSize}
                onClick={() => this.setState({ show: true, mode: 'url' })}
                className="clickable-icon toolbar-icon pull-right"
              />
            </OverlayTrigger>
            {'  '}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="download-image">download</Tooltip>}
            >
              <MdFileDownload
                size={iconSize}
                onClick={() => this.setState({ show: true, mode: 'download' })}
                className="clickable-icon toolbar-icon pull-right"
              />
            </OverlayTrigger>
            {this.props.chartId !== 1.17 && (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="reset-view">reset view</Tooltip>}
              >
                <MdRefresh
                  size={iconSize}
                  onClick={() => {
                    if ([1.09, 1.23].includes(this.props.chartId)) {
                      // simple map & pie chart map
                      this.props.viewer.setState({
                        center: mapSettings[this.props.moreSettings.map].center,
                        zoom: Math.min(
                          this.props.width / 980,
                          this.props.height / 551
                        )
                      })
                    } else if (this.props.chartId === 1.13) {
                      // choropleth map
                      this.props.viewer.setState({
                        center:
                          map2Settings[this.props.moreSettings.map2].center,
                        zoom: Math.min(
                          this.props.width / 980,
                          this.props.height / 551
                        )
                      })
                    } else if (this.props.chartId === 1.11) {
                      // cartogram map
                      d3
                        .select('.cartogram')
                        .selectAll('path')
                        .attr('transform', 'translate(0) scale(1)')
                    } else {
                      this.props.viewer.reset()
                    }
                  }}
                  className="clickable-icon toolbar-icon pull-right"
                />
              </OverlayTrigger>
            )}
          </div>
        )}

        {this.props.chartId === 1.16 && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="fit-markers">fit markers</Tooltip>}
          >
            <MdCropFree
              size={iconSize}
              onClick={this.props.fitBounds}
              className="clickable-icon toolbar-icon pull-right"
            />
          </OverlayTrigger>
        )}

        <Modal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        >
          <Modal.Header>
            <Modal.Title>
              {this.state.mode === 'download'
                ? 'Download Image'
                : 'Get SVG URL'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  File name
                </Col>
                <Col sm={6}>
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={this.state.filename}
                      placeholder="Enter file name"
                      onChange={e =>
                        this.setState({ filename: e.target.value })
                      }
                    />
                    {this.state.mode === 'download' && (
                      <DropdownButton
                        componentClass={InputGroup.Button}
                        id="choose-file-format"
                        title={this.state.format}
                        onSelect={(eventKey, e) => {
                          this.setState({
                            format: eventKey === '1' ? '.svg' : '.png'
                          })
                        }}
                      >
                        <MenuItem eventKey="1">.svg</MenuItem>
                        <MenuItem eventKey="2">.png</MenuItem>
                      </DropdownButton>
                    )}
                    {this.state.mode === 'url' && (
                      <InputGroup.Addon>.svg</InputGroup.Addon>
                    )}
                  </InputGroup>
                </Col>
              </FormGroup>
              {this.state.format === '.png' &&
                this.state.mode === 'download' && (
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                      Scale
                    </Col>
                    <Col sm={6}>
                      <ReactBootstrapSlider
                        value={this.state.scale}
                        slideStop={e => {
                          this.setState({ scale: e.target.value })
                        }}
                        step={0.1}
                        min={0.1}
                        max={10}
                      />
                    </Col>
                  </FormGroup>
                )}
            </Form>
            {this.state.mode === 'url' && (
              <Form horizontal>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>
                    Gist URL
                  </Col>
                  <Col sm={6}>
                    <InputGroup>
                      <FormControl
                        type="text"
                        disabled={true}
                        value={this.state.gistUrl}
                        style={{ cursor: 'default' }}
                      />
                      <InputGroup.Button>
                        <OverlayTrigger
                          placement="bottom"
                          onExited={() =>
                            this.setState({ copyMessage: 'copy' })
                          }
                          overlay={
                            <Tooltip id="copy-url">
                              {this.state.copyMessage}
                            </Tooltip>
                          }
                        >
                          <CopyToClipboard text={this.state.gistUrl}>
                            <Button
                              onClick={() =>
                                this.setState({ copyMessage: 'copied' })
                              }
                              onMouseOver={() =>
                                this.setState({ showTooltip: true })
                              }
                            >
                              <MdContentCopy size={16} />
                            </Button>
                          </CopyToClipboard>
                        </OverlayTrigger>
                      </InputGroup.Button>
                    </InputGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>
                    Image URL
                  </Col>
                  <Col sm={6}>
                    <InputGroup>
                      <FormControl
                        type="text"
                        disabled={true}
                        value={this.state.rawGitUrl}
                        style={{ cursor: 'default' }}
                      />
                      <InputGroup.Button>
                        <OverlayTrigger
                          placement="bottom"
                          onExited={() =>
                            this.setState({ copyMessage: 'copy' })
                          }
                          overlay={
                            <Tooltip id="copy-url">
                              {this.state.copyMessage}
                            </Tooltip>
                          }
                        >
                          <CopyToClipboard text={this.state.rawGitUrl}>
                            <Button
                              onClick={() =>
                                this.setState({ copyMessage: 'copied' })
                              }
                              onMouseOver={() =>
                                this.setState({ showTooltip: true })
                              }
                            >
                              <MdContentCopy size={16} />
                            </Button>
                          </CopyToClipboard>
                        </OverlayTrigger>
                      </InputGroup.Button>
                    </InputGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>
                    Shortened URL
                  </Col>
                  <Col sm={6}>
                    <InputGroup>
                      <FormControl
                        type="text"
                        disabled={true}
                        value={this.state.tinyUrl}
                        style={{ cursor: 'default' }}
                      />
                      <InputGroup.Button>
                        <OverlayTrigger
                          placement="bottom"
                          onExited={() =>
                            this.setState({ copyMessage: 'copy' })
                          }
                          overlay={
                            <Tooltip id="copy-url">
                              {this.state.copyMessage}
                            </Tooltip>
                          }
                        >
                          <CopyToClipboard text={this.state.tinyUrl}>
                            <Button
                              onClick={() =>
                                this.setState({ copyMessage: 'copied' })
                              }
                              onMouseOver={() =>
                                this.setState({ showTooltip: true })
                              }
                            >
                              <MdContentCopy size={16} />
                            </Button>
                          </CopyToClipboard>
                        </OverlayTrigger>
                      </InputGroup.Button>
                    </InputGroup>
                  </Col>
                </FormGroup>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            {this.state.mode === 'download' && (
              <div>
                <Button bsStyle="primary" onClick={this.saveImage}>
                  Download
                </Button>
                <Button onClick={() => this.setState({ show: false })}>
                  Close
                </Button>
              </div>
            )}
            {this.state.mode === 'url' && (
              <div>
                <span className="clip-loader">
                  <ClipLoader
                    color={'#337ab7'}
                    loading={this.state.started}
                    size={iconSize}
                  />
                </span>
                <Button bsStyle="primary" onClick={this.getImageURL}>
                  Get
                </Button>
                <Button
                  disabled={!this.state.rawGitUrl.startsWith('http')}
                  onClick={() =>
                    window.open(
                      `https://svg-edit.github.io/svgedit/releases/svg-edit-2.8.1/svg-editor.html?dimensions=${
                        this.props.width
                      },${this.props.height}&url=${encodeURIComponent(
                        this.state.rawGitUrl
                      )}`,
                      '_blank'
                    )
                  }
                >
                  Edit online
                </Button>
                <Button onClick={() => this.setState({ show: false })}>
                  Close
                </Button>
              </div>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Tools
