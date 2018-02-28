import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { examples } from '../utils/examples'
import MdSearch from 'react-icons/lib/md/search'

class Examples extends Component {
  filterComponent = ({ filter, onChange }) => (
    <div className="pull-right">
      <div style={{ position: 'absolute', marginLeft: '3px' }}>
        <MdSearch
          size={18}
          color="#999"
          style={{ verticalAlign: '-webkit-baseline-middle' }}
        />
      </div>
      <input
        type="text"
        onChange={event => onChange(event.target.value)}
        size="100px"
        style={{ paddingLeft: '22px' }}
      />
    </div>
  )

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
        columns={[
          {
            Header: () => <h4>Wikidata Query Examples</h4>,
            accessor: 'title',
            Filter: this.filterComponent
          }
        ]}
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
        showPageSizeOptions={false}
        noDataText="No query examples found"
      />
    )
  }
}

export default Examples
