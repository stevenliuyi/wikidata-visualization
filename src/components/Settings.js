import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col } from 'react-bootstrap'

class Settings extends Component {

  componentWillMount() {
    this.onSettingsChange = this.onSettingsChange.bind(this)
  }

  onSettingsChange(event) {
    const settings = this.props.settings
    settings[event.target.name] = parseInt(event.target.value)
    this.props.onChange(settings)
  }

  render() {
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>X-axis</Col>
          <Col sm={8}><FormControl
            name="x-axis"
            componentClass="select"
            value={this.props.settings['x-axis']}
            onChange={this.onSettingsChange}
          >
            {
              Array.isArray(this.props.header) &&
              this.props.numberIndices.map((index) => (
                <option value={index}>{this.props.header[index]}</option>
              ))
            }
          </FormControl></Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>Y-axis</Col>
          <Col sm={8}><FormControl
            name="y-axis"
            componentClass="select"
            value={this.props.settings['y-axis']}
            onChange={this.onSettingsChange}
          >
            {
              Array.isArray(this.props.header) &&
              this.props.numberIndices.map((index) => (
                <option value={index}>{this.props.header[index]}</option>
              ))
            }
          </FormControl></Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>Show label</Col>
          <Col sm={8}><FormControl
            name="label"
            componentClass="select"
            value={this.props.settings['label']}
            onChange={this.onSettingsChange}
          >
            <option value="-1">none</option>
            {
              Array.isArray(this.props.header) &&
              this.props.header.map((col, index) => {
                return (<option value={index}>{col}</option>)
              })
            }
          </FormControl></Col>
        </FormGroup>
      </Form>
    )
  }
}

export default Settings
