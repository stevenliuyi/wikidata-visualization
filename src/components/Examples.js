import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { examples } from '../utils/examples'

class Examples extends Component {
  getTrProps = (state, rowInfo) => {
    if (rowInfo) {
      return {
        onClick: e => {
          this.props.onSelect(rowInfo.index)
        },
        style: {
          cursor: 'pointer'
        }
      }
    } else {
      return {}
    }
  }

  render() {
    return (
      <ReactTable
        data={examples.sort((a, b) => a.title.localeCompare(b.title))}
        sortable={false}
        filterable
        columns={[{ Header: 'Wikidata Query Examples', accessor: 'title' }]}
        defaultPageSize={10}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id
          return row[id] !== undefined
            ? String(row[id])
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            : true
        }}
        getTrProps={this.getTrProps}
        className="-highlight"
        pageSizeOptions={[10]}
      />
    )
  }
}

export default Examples
