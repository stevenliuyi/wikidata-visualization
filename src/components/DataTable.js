import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class DataTable extends Component {

  render() {
    return (
      <Table striped hover responsive>
        <thead><tr>
          { Array.isArray(this.props.header) &&
            this.props.header.map((col, index) =>
              (<th key={index}>{col}</th>))
          }
        </tr></thead>
        <tbody>
          { Array.isArray(this.props.data) &&
            this.props.data.map((item, index) => (
              <tr key={index}>
                {
                  this.props.header.map((col, index) => (
                    <td key={index}>{ item[col] }</td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}

export default DataTable
