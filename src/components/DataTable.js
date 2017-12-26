import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class DataTable extends Component {

  render() {
    return (
      <Table striped hover responsive>
        <thead><tr>
          { Array.isArray(this.props.header) &&
            this.props.header.map(col => (<th>{col}</th>))
          }
        </tr></thead>
        <tbody>
          { Array.isArray(this.props.data) &&
            this.props.data.map(item => (
              <tr>
                {
                  this.props.header.map(col => (
                    <td>{ item[col] }</td>
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
