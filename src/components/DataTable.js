import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import checkboxHOC from 'react-table/lib/hoc/selectTable'
import { Label, OverlayTrigger, Tooltip, Col, Row } from 'react-bootstrap'
import { getDataTypeIndices, getCoordArray } from '../utils/convertData'
import { getURL, getCommonsURL } from '../utils/commons'
import Info from './Info'
import MdArrowForward from 'react-icons/lib/md/arrow-forward'
import TimePicker from './TimePicker'
import moment from 'moment'
import { formatBCDates } from '../utils/format'
import * as d3 from 'd3'

const CheckboxTable = checkboxHOC(ReactTable)

class DataTable extends Component {
  state = {
    selectAll: true,
    table: CheckboxTable,
    isCheckboxTable: true,
    numericRangeFilter: false,
    timeRangeFilter: false,
    filtered: [],
    starttimes: {},
    endtimes: {}
  }

  componentDidMount() {
    this.renderFormula()
  }

  componentDidUpdate() {
    this.renderFormula()
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.moreSettings.numericRangeFilter !==
      this.state.numericRangeFilter
    ) {
      this.setState({
        numericRangeFilter: nextProps.moreSettings.numericRangeFilter
      })
      // reset filter values
      this.setState({ filtered: [] })
    }
    if (nextProps.moreSettings.timeRangeFilter !== this.state.timeRangeFilter) {
      this.setState({
        timeRangeFilter: nextProps.moreSettings.timeRangeFilter
      })
      // reset filter values
      this.setState({ filtered: [] })
    }
  }

  // render math formulas
  renderFormula() {
    if (window.MathJax != null)
      d3.selectAll('.formula').call(function() {
        window.MathJax.Hub.Queue([
          'Typeset',
          window.MathJax.Hub,
          d3.select(this).node()
        ])
      })
  }

  toggleTable = () => {
    if (this.state.isCheckboxTable) {
      this.setState({ table: ReactTable, isCheckboxTable: false })
    } else {
      this.setState({ table: CheckboxTable, isCheckboxTable: true })
    }
  }

  // determine how to display the data in the cells
  convertDataToCell = (row, col) => {
    const dataType = this.props.dataTypes[this.props.header.indexOf(col)]
    if (dataType === 'item') {
      return (
        <div>
          <a
            target="_blank"
            href={`https://www.wikidata.org/entity/${row.value}`}
          >
            {row.value}
          </a>
          {this.props.moreSettings.reasonator && (
            <span className="sm-badge pull-right">
              {' '}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-reasonator">
                    View with Reasonator
                  </Tooltip>
                }
              >
                <Label>
                  <a
                    target="_blank"
                    href={`https://tools.wmflabs.org/reasonator/test/?q=${
                      row.value
                    }`}
                  >
                    R
                  </a>
                </Label>
              </OverlayTrigger>{' '}
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-sqid">View with SQID</Tooltip>}
              >
                <Label>
                  <a
                    target="_blank"
                    href={`https://tools.wmflabs.org/sqid#view?id=${row.value}`}
                  >
                    S
                  </a>
                </Label>
              </OverlayTrigger>
            </span>
          )}
        </div>
      )
    } else if (dataType === 'image' && row.value != null) {
      return (
        <a target="_blank" href={getCommonsURL(row.value)}>
          <img
            src={getURL(getCommonsURL(row.value), '50px')}
            width={48}
            alt=""
          />
        </a>
      )
    } else if (dataType === 'time') {
      return row.value != null
        ? moment(formatBCDates(row.value)).format('ll')
        : ''
    } else if (dataType === 'formula') {
      return row.value != null ? (
        <div
          className="formula"
          dangerouslySetInnerHTML={{ __html: row.value }}
        />
      ) : (
        ''
      )
    } else if (dataType === 'url') {
      return (
        <a target="_blank" href={row.value}>
          {row.value}
        </a>
      )
    } else if (dataType === 'commons' && row.value != null) {
      return (
        <a target="_blank" href={getCommonsURL(row.value)}>
          {row.value}
        </a>
      )
    } else {
      return row.value
    }
  }

  tidyData = () => {
    const coordIndices = getDataTypeIndices(this.props.dataTypes, 'coordinate')
    // seperate coordinates into two columns
    const tidified = this.props.data.map((item, i) => {
      item['_id'] = i // add id for Select Table
      coordIndices
        .filter(index => item[this.props.header[index]] != null)
        .forEach(index => {
          const [coordX, coordY] = getCoordArray(item[this.props.header[index]])
          item[`${this.props.header[index]} (Lon)`] = coordX
          item[`${this.props.header[index]} (Lat)`] = coordY
        })
      return item
    })
    // get new header
    let header = this.props.header.map((col, i) => {
      if (coordIndices.indexOf(i) < 0) {
        return col
      } else {
        // coordinate type
        return [`${col} (Lon)`, `${col} (Lat)`]
      }
    })
    header = [].concat.apply([], header)

    return [tidified, header]
  }

  // reference for Select Table: https://react-table.js.org/#/story/select-table-hoc
  isSelected = key => {
    return this.props.selection.includes(key)
  }

  toggleSelection = (key, shift, row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    let selection = [...this.props.selection]
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
    currentRecords.forEach(item => {
      currentSelection.push(item._original._id)
    })

    let newSelection = []
    if (selectAll) {
      newSelection = [...new Set(this.props.selection.concat(currentSelection))]
    } else {
      newSelection = this.props.selection.filter(
        key => currentSelection.indexOf(key) < 0
      )
    }
    this.setState({ selectAll })
    this.props.updateSelection(newSelection)
  }

  defaultFilterMethod = (filter, row) => {
    const id = filter.pivotId || filter.id
    let value = this.props.moreSettings.ignoreCase
      ? String(row[id]).toLowerCase()
      : String(row[id])
    if (row[id] == null) value = ''
    const filterValue = this.props.moreSettings.ignoreCase
      ? filter.value.toLowerCase()
      : filter.value
    return value.includes(filterValue)
  }

  regexFilterMethod = (filter, row) => {
    const id = filter.pivotId || filter.id
    try {
      const re = this.props.moreSettings.ignoreCase
        ? new RegExp(filter.value, 'i')
        : new RegExp(filter.value)

      const value = row[id] != null ? String(row[id]) : ''
      return value.match(re) != null
    } catch (e) {
      // invaild RegExp encountered, use default method instead
      return this.defaultFilterMethod(filter, row)
    }
  }

  rangeFilterMethod = (filter, row) => {
    const id = filter.pivotId || filter.id
    const [fromValue, toValue] = filter.value.split('to').map(parseFloat)

    return parseFloat(row[id]) >= fromValue && parseFloat(row[id]) <= toValue
  }

  timeRangeFilterMethod = (filter, row) => {
    const id = filter.pivotId || filter.id
    const [startTime, endTime] = filter.value.split('to')
    const time = row[id] != null ? moment(formatBCDates(row[id])) : null

    if (startTime !== 'NULL' && endTime !== 'NULL') {
      if (time == null) return false
      return moment(startTime).isBefore(time) && moment(endTime).isAfter(time)
    } else if (startTime !== 'NULL') {
      if (time == null) return false
      return moment(startTime).isBefore(time)
    } else if (endTime !== 'NULL') {
      if (time == null) return false
      return moment(endTime).isAfter(time)
    } else {
      return true
    }
  }

  getRangeString = (value, colIndex, from = true) => {
    let fromValue = from
      ? parseFloat(value)
      : parseFloat(document.getElementById(`col${colIndex}-from`).value)
    if (isNaN(fromValue)) fromValue = -Infinity

    let toValue = from
      ? parseFloat(document.getElementById(`col${colIndex}-to`).value)
      : parseFloat(value)
    if (isNaN(toValue)) toValue = Infinity

    return `${fromValue}to${toValue}`
  }

  handleTimeRangeChange = (date, colIndex, onChange, from = true) => {
    const startTime = this.state.starttimes[colIndex]
    const endTime = this.state.endtimes[colIndex]
    const fromValue = from
      ? date != null ? date.toISOString() : 'NULL'
      : startTime != null ? startTime.toISOString() : 'NULL'
    const toValue = from
      ? endTime != null ? endTime.toISOString() : 'NULL'
      : date != null ? date.toISOString() : 'NULL'

    if (from) {
      this.setState(prevState => {
        let starttimes = prevState.starttimes
        starttimes[colIndex] = date
        return { starttimes }
      })
    } else {
      this.setState(prevState => {
        let endtimes = prevState.endtimes
        endtimes[colIndex] = date
        return { endtimes }
      })
    }

    const rangeString = `${fromValue}to${toValue}`
    onChange(rangeString)
  }

  getFilterMethod = col => {
    const dataType = this.getDataType(col)

    if (dataType === 'number' && this.props.moreSettings.numericRangeFilter) {
      return this.rangeFilterMethod
    } else if (dataType === 'time' && this.props.moreSettings.timeRangeFilter) {
      return this.timeRangeFilterMethod
    } else {
      return undefined // default filter method
    }
  }

  filterComponent = col => {
    const [dataType, colIndex] = this.getDataType(col, true)

    if (dataType === 'number' && this.props.moreSettings.numericRangeFilter) {
      let component = ({ filter, onChange }) => (
        <Row>
          <Col sm={5} className="no-padding-right">
            <input
              id={`col${colIndex}-from`}
              type="text"
              onChange={event =>
                onChange(
                  this.getRangeString(event.target.value, colIndex, true)
                )
              }
              style={{ width: '100%' }}
            />
          </Col>
          <Col sm={2} className="no-padding">
            <MdArrowForward />
          </Col>
          <Col sm={5} className="no-padding-left">
            <input
              id={`col${colIndex}-to`}
              type="text"
              onChange={event =>
                onChange(
                  this.getRangeString(event.target.value, colIndex, false)
                )
              }
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      )
      return component
    } else if (dataType === 'time' && this.props.moreSettings.timeRangeFilter) {
      let component = ({ filter, onChange }) => (
        <Row>
          <Col sm={5} className="no-padding-right">
            <TimePicker
              selected={this.state.starttimes[colIndex]}
              onChange={date =>
                this.handleTimeRangeChange(date, colIndex, onChange, true)
              }
            />
          </Col>
          <Col sm={2} className="no-padding">
            <MdArrowForward />
          </Col>
          <Col sm={5} className="no-padding-left">
            <TimePicker
              selected={this.state.endtimes[colIndex]}
              onChange={date =>
                this.handleTimeRangeChange(date, colIndex, onChange, false)
              }
            />
          </Col>
        </Row>
      )
      return component
    } else {
      return undefined // default filter component
    }
  }

  itemSortMethod = (a, b, desc) => {
    const aValue = parseInt(a.substr(1), 10)
    const bValue = parseInt(b.substr(1), 10)
    if (aValue > bValue) return 1
    if (aValue < bValue) return -1
    return 0
  }

  getSortMethod = col => {
    const dataType = this.getDataType(col)

    if (dataType !== 'item') {
      return undefined // default sort method
    } else {
      return this.itemSortMethod
    }
  }

  getDataType = (col, returnColIndex = false) => {
    let colIndex = this.props.header.indexOf(col)
    let dataType = this.props.dataTypes[colIndex]

    // coordinates are shown in two columns, numbers in both columns are treated as numeric values
    if (col.endsWith(' (Lon)') || col.endsWith(' (Lat)')) {
      colIndex = `${this.props.header.indexOf(col.slice(0, -6))}${col.slice(
        -5
      )}`
      dataType = 'number'
    }

    return returnColIndex ? [dataType, colIndex] : dataType
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
      <div id="data-table">
        {Array.isArray(this.props.data) &&
          this.props.data.length >= 1 && (
            <this.state.table
              ref={r => (this.checkboxTable = r)}
              data={data}
              filterable
              filtered={this.state.filtered}
              columns={header.map(col => {
                return {
                  Header: col,
                  accessor: col,
                  Cell: row => this.convertDataToCell(row, col),
                  filterMethod: this.getFilterMethod(col),
                  Filter: this.filterComponent(col),
                  sortMethod: this.getSortMethod(col)
                }
              })}
              defaultPageSize={10}
              defaultFilterMethod={
                this.props.moreSettings.regex
                  ? this.regexFilterMethod
                  : this.defaultFilterMethod
              }
              className="-striped -highlight"
              pageSizeOptions={[10, 20, 50, 100, 200, 500, 1000]}
              onFilteredChange={filtered => this.setState({ filtered })}
              onPageChange={this.renderFormula}
              onPageSizeChange={this.renderFormula}
              onSortedChange={this.renderFormula}
              getTheadFilterThProps={() => {
                // fix date picker display issue
                return {
                  style: { overflow: 'inherit' }
                }
              }}
              {...checkboxProps}
            />
          )}
        {Array.isArray(this.props.data) &&
          this.props.data.length === 0 && <Info info="no-data" />}
      </div>
    )
  }
}

export default DataTable
