import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Well } from 'react-bootstrap'

class DataTable extends Component {

  render() {
    return (
      <div>
        { Array.isArray(this.props.data) && this.props.data.length >= 1 &&
          <ReactTable
            data={this.props.data}
            filterable
            columns={ this.props.header.map( col => {
              return { Header: col, accessor: col }
            })}
            defaultPageSize={10}
            defaultFilterMethod={(filter, row) => {
              const id = filter.pivotId || filter.id
              return row[id] !== undefined ?
                String(row[id]).toLowerCase().includes(filter.value.toLowerCase()) :
                true
            }}
            className='-striped -highlight'
            pageSizeOptions={[10, 20, 50, 100, 200, 500, 1000]}
          />
        }
        { Array.isArray(this.props.data) && this.props.data.length === 0 &&
          <Well className='no-data-text'>No data now, please submit a new query!</Well>
        }
      </div>
    )
  }
}

export default DataTable
