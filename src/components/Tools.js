import React, { Component } from 'react'
import MdFileDownload from 'react-icons/lib/md/file-download'
import * as d3 from 'd3'
import saveSvgAsPng from 'save-svg-as-png'
import { Modal, Button, Form, FormGroup, FormControl, InputGroup, Col, ControlLabel, DropdownButton, MenuItem, OverlayTrigger, Tooltip } from 'react-bootstrap'
import ReactBootstrapSlider from 'react-bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css'

class Tools extends Component {

  state = {
    show: false,
    format: '.svg',
    scale: 1,
    filename: ''
  }

  getSvgNode = () => {
    const svgNode = d3.selectAll('svg').filter((d,i)=>(i===7))
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .node()

    return svgNode
  }

  saveSVG = () => {
    const svgBlob = new Blob([this.getSvgNode().outerHTML], {type:'image/svg+xml;charset=utf-8'})
    const svgUrl = URL.createObjectURL(svgBlob)

    const link = document.createElement('a')
    link.href = svgUrl
    link.download = `${this.state.filename}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  savePNG = () => {
    saveSvgAsPng.saveSvgAsPng(
      this.getSvgNode(),
      `${this.state.filename}.png`,
      {scale: this.state.scale})
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
      <div>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='download-image'>download</Tooltip>
        }>
          <MdFileDownload
            size={20}
            onClick={()=>this.setState({ show: true })}
            className='clickable-icon pull-right'
          />
        </OverlayTrigger>
        <Modal show={this.state.show} onHide={()=>this.setState({ show: false })}>
          <Modal.Header>
            <Modal.Title>Download Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>File name</Col>
                <Col sm={6}><InputGroup>
                  <FormControl
                    type='text'
                    value={this.state.filename}
                    placeholder='Enter file name'
                    onChange={(e)=>this.setState({ filename: e.target.value })}
                  />
                  <DropdownButton
                    componentClass={InputGroup.Button}
                    id='choose-file-format'
                    title={this.state.format}
                    onSelect={(eventKey,e) => {
                      this.setState({ format: (eventKey === '1') ? '.svg' : '.png' })
                    }}   
                  >
                    <MenuItem eventKey='1'>.svg</MenuItem>
                    <MenuItem eventKey='2'>.png</MenuItem>
                  </DropdownButton>
                </InputGroup></Col>
              </FormGroup>
              { this.state.format === '.png' && (
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Scale</Col>
                  <Col sm={6}>
                    <ReactBootstrapSlider
                      value={this.state.scale}
                      slideStop={(e)=>{ this.setState({ scale: e.target.value}) }}
                      step={0.1}
                      min={0.1}
                      max={10} />
                  </Col>
                </FormGroup>
              )
              }
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>this.setState({ show: false })}>Close</Button>
            <Button bsStyle='primary' onClick={this.saveImage}>Download</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Tools
