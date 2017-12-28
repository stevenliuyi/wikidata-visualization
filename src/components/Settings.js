import React, { Component } from 'react'
import { Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap'

class Settings extends Component {

  componentWillMount() {
    this.onSettingsChange = this.onSettingsChange.bind(this)
  }

  onSettingsChange(event) {
    const settings = this.props.settings
    settings[event.target.name] = parseInt(event.target.value, 10)
    this.props.onChange(settings)
  }

  render() {
    return (
      <Form horizontal>
        {
          Array.isArray(this.props.info) &&
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
    )
  }
}

export default Settings
