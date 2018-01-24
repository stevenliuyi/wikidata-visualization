import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import checkboxHOC from 'react-table/lib/hoc/selectTable'
import { Well } from 'react-bootstrap'
import { getDataTypeIndices } from '../utils/convertData'
import { getURL } from '../utils/commons'

const CheckboxTable = checkboxHOC(ReactTable)

class DataTable extends Component {

  state = {
    selectAll: true,
    table: CheckboxTable,
    isCheckboxTable: true,
  }

  toggleTable = () => {
    if (this.state.isCheckboxTable) {
      this.setState({table: ReactTable, isCheckboxTable: false})
    } else  {
      this.setState({table: CheckboxTable, isCheckboxTable: true})
    }
  }

  // determine how to display the data in the cells
  convertDataToCell = (row, col) => {
    const dataType = this.props.dataTypes[this.props.header.indexOf(col)]
    if (dataType === 'item') {
      return (<a target='_blank' href={`https://www.wikidata.org/wiki/${row.value}`}>{row.value}</a>)
    } else if (dataType === 'image' && row.value != null) {
      return (<a target='_blank' href={row.value}><img src={getURL(row.value, '50px')} width={48} alt='' /></a>)
    } else {
      return row.value
    }
  }

  tidyData = () => {
    const coordIndices = getDataTypeIndices(this.props.dataTypes, 'coordinate')
    // seperate coordinates into two columns
    const tidified = this.props.data.map((item, i) => {
      item['_id'] = i // add id for Select Table
      coordIndices.filter(index => item[this.props.header[index]] != null)
        .forEach(index => {
          const [coordX, coordY] = item[this.props.header[index]].split(', ').map(parseFloat)
          item[`${this.props.header[index]} (Lon)`] = coordX
          item[`${this.props.header[index]} (Lat)`] = coordY
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

  // reference for Select Table: https://react-table.js.org/#/story/select-table-hoc
  isSelected = (key) => {
    return this.props.selection.includes(key)
  }

  toggleSelection = (key, shift, row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    let selection = [
      ...this.props.selection
    ]
    const keyIndex = selection.indexOf(key)
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ]
    } else {
      // it does not exist so add it
      selection.push(key)
    }
    // update the state
    //this.setState({ selection });
    this.props.updateSelection(selection)
  }

  toggleAll = () => {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?
      
      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).
      
      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).
      
      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'. 
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selectAll = this.state.selectAll ? false : true
    const currentSelection = []
    // we need to get at the internals of ReactTable
    const wrappedInstance = this.checkboxTable.getWrappedInstance()
    // the 'sortedData' property contains the currently accessible records based on the filter and sort
    const currentRecords = wrappedInstance.getResolvedState().sortedData
    // we just push all the IDs onto the selection array
    currentRecords.forEach((item) => {
      currentSelection.push(item._original._id)
    })

    let newSelection = []
    if (selectAll) {
      newSelection = [...new Set(this.props.selection.concat(currentSelection))]
    } else {
      newSelection = this.props.selection.filter(key => currentSelection.indexOf(key) < 0)
    }
    this.setState({ selectAll })
    this.props.updateSelection(newSelection)
  }

  render() {
    const [data, header] = this.tidyData()

    const checkboxProps = {
      selectAll: this.state.selectAll,
      isSelected: this.isSelected,
      toggleSelection: this.toggleSelection,
      toggleAll: this.toggleAll,
      selectType: 'checkbox'
    }

    return (
      <div>
        { Array.isArray(this.props.data) && this.props.data.length >= 1 &&
          <this.state.table
            ref={(r)=>this.checkboxTable=r}
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
            {...checkboxProps}
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
