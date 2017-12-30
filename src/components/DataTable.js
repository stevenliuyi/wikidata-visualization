import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Well } from 'react-bootstrap'
import { getDataTypeIndices } from '../utils/convertData'

class DataTable extends Component {

  // determine how to display the data in the cells
  convertDataToCell = (row, col) => {
    const dataType = this.props.dataTypes[this.props.header.indexOf(col)]
    if (dataType === 'item') {
      return (<a target='_blank' href={`https://www.wikidata.org/wiki/${row.value}`}>{row.value}</a>)
    } else {
      return row.value
    }
  }

  tidyData = () => {
    const coordIndices = getDataTypeIndices(this.props.dataTypes, 'coordinate')
    // seperate coordinates into two columns
    const tidified = this.props.data.map(item => {
      coordIndices.map(index => {
        const [coordX, coordY] = item[this.props.header[index]].split(', ').map(parseFloat)
        item[`${this.props.header[index]} (Lon)`] = coordX
        item[`${this.props.header[index]} (Lat)`] = coordY
        return null
      })
      return item
    })
    // get new header
    let header = this.props.header.map((col, i) => {
      if (coordIndices.indexOf(i) < 0) { 
        return col
      } else { // coordinate type
        return [`${col} (Lon)`, `${col} (Lat)`]
      }
    })
    header = [].concat.apply([], header)

    return [tidified, header]
  }

  render() {
    let data = this.props.data
    let header = this.props.header
    // there are coordinate types in the dataset
    if (this.props.dataTypes.indexOf('coordinate') >= 0) [data, header] = this.tidyData()

    return (
      <div>
        { Array.isArray(this.props.data) && this.props.data.length >= 1 &&
          <ReactTable
            data={data}
            filterable
            columns={ header.map( col => {
              return {
                Header: col,
                accessor: col,
                Cell: row => this.convertDataToCell(row, col),
              }
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
