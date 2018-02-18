import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'

class SettingPanel extends Component {
  convert = title => (title !== '' ? title : '　')

  render() {
    const settingTitles = Object.keys(this.props.settings)
    const leftSettingTitles = settingTitles.filter((_, i) => i % 2 === 0)
    const rightSettingTitles = settingTitles.filter((_, i) => i % 2 === 1)
    const nRows = Math.ceil(settingTitles.length / 2)
    return (
      <div>
        {nRows > 0 &&
          [...Array(nRows).keys()].map(iRow => (
            <Row key={iRow} className="setting-row">
              <Col xs={6}>
                <div className="setting-title">
                  {this.convert(leftSettingTitles[iRow])}
                </div>
                {this.props.settings[leftSettingTitles[iRow]]}
              </Col>
              <Col xs={6}>
                {rightSettingTitles[iRow] != null && (
                  <div>
                    <div className="setting-title">
                      {this.convert(rightSettingTitles[iRow])}
                    </div>
                    {this.props.settings[rightSettingTitles[iRow]]}
                  </div>
                )}
              </Col>
            </Row>
          ))}
      </div>
    )
  }
}

export default SettingPanel
