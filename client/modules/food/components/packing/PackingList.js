/**
 * Component to display a table of all the packages that need to be packed
 */
const  MIN_DAYS_SINCE_LAST_PACKED_TO_SHOW = 7
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {compose, withProps} from 'recompose'
import {Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn, SizePerPageDropDown} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../../store/selectors'
import {loadCustomers} from '../../../customer/reducer'
import {loadFoods} from '../../reducers/category'
import {pack, clearPackingFlags} from '../../reducers/packing'

import {Box, BoxBody, BoxHeader} from '../../../../components/box'
import {Checkbox} from '../../../../components/form'
import PackModal from './PackModal'
import moment from 'moment'

const mapStateToProps = state => ({
  customers: selectors.customer.getScheduled(state),
  scheduledItems: selectors.food.item.getScheduled(state),
  allItems: selectors.food.item.getAll(state),
  loading: selectors.customer.loading(state) ||
    selectors.food.category.loading(state) ||
    selectors.food.packing.loading(state),
  loadError: selectors.customer.loadError(state) ||
    selectors.food.category.loadError(state),
  packSaving: selectors.food.packing.saving(state),
  packSaveError: selectors.food.packing.saveError(state),
})

const mapDispatchToProps = dispatch => ({
  load: () => {
    dispatch(loadCustomers())
    dispatch(loadFoods())
  },
  packSelected: packages => dispatch(pack(packages)),
  clearPackingFlags: () => dispatch(clearPackingFlags())
})

const withPackedCustomers = withProps(({customers, scheduledItems}) =>
  getPackedCustomersAndItems(customers, scheduledItems))

class PackingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: [],
      showModal: false,
    }
  }

  componentWillMount() {
    this.props.load()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.packSaving && !nextProps.packSaving && !nextProps.packSavingError)
      this.setState({selected: []})
  }

  packSelected = () => {
    // generate packing lists for selected customers and updated item counts
    const customers = this.state.selected.map(id => this.props.customers.find(c => c._id === id))
    const {packedCustomers} = getPackedCustomersAndItems(customers, this.props.scheduledItems)

    const packages = packedCustomers.map(customer => ({
      customer: customer._id,
      contents: customer.packingList.map(item => item._id)
    }))

    this.props.packSelected(packages)
  }

  tooltip = content => (
    <Tooltip id="tooltip">{content}</Tooltip>
  )

  getItemList = items => {
    const content = items.map(i => i.name).join(', ')
    return (
      <OverlayTrigger placement="top" overlay={this.tooltip(content)}>
        <div>{content}</div>
      </OverlayTrigger>
    )
  }

  select(props) {
    const {type, checked, disabled, onChange, rowIndex} = props

    return rowIndex === 'Header' ?
      <Checkbox
        type={type}
        name="checkboxAll"
        checked={checked}
        disabled={disabled}
        className={props.indeterminate ? 'partial' : ''}
        onChange={onChange}
        style={{margin: '0 0 0 -8px'}}
      /> :
      <Checkbox
        type={type}
        name={'checkbox' + rowIndex}
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e, rowIndex)}
        style={{margin: '0 0 0 -8px'}}
      />
  }

  handleSelect = (customer, isSelected) => this.setState({
    selected: isSelected ?
      [...this.state.selected, customer._id] :
      this.state.selected.filter(id => id !== customer._id)
  })

  handleSelectAll = isSelected => {
    const {selected} = this.state
    const customers = this.props.packedCustomers.filter(c => c.foodPreferences.length > 0)

    this.setState({
      selected: isSelected || selected.length < customers.length ?
        customers.map(c => c._id) : []
    })
  }

  /**
   * Gets the Pack button used in the bootstrap table rows
   */
  getPackButton = (cell, row) =>{
    return (<Button onClick={this.onPackClick} bsStyle="primary" bsSize="xs" value={row._id}>
      Pack
    </Button>)
  }

  /**
   * Handler for when the pack button is clicked on a row in the Packing List
   */
  onPackClick = e => {
    const customerId = e.target.value
    this.props.clearPackingFlags()
    this.setState({
      showModal: true,
      modalCustomer: this.props.packedCustomers.find(customer => customer._id.toString() === customerId)
    })
  }

  closePackModal = () => {
    this.setState({showModal: false, modalCustomer: undefined})
    this.props.clearPackingFlags()
  }

  renderSizePerPageDropDown = () => <SizePerPageDropDown variation='dropup'/>

  render() {
    const {loading, packSaving, loadError, packSaveError, packedCustomers} = this.props
    const {selected} = this.state
    const unselectable = packedCustomers.filter(c => c.foodPreferences.length === 0).map(c => c._id)
    const itemsToPack = packedCustomers.reduce((acc, c) =>
      acc + c.packingList.length, 0)
    // Don't show error when modal is showing
    const error = this.state.showModal ? null : (loadError || packSaveError)

    return (
      <Box>
        <BoxHeader heading="Packing List" />
        <BoxBody loading={loading || packSaving} error={error} errorBottom={true}>
          {packedCustomers &&
            <div style={{color: '#aaa'}}>
              {itemsToPack} items for {packedCustomers.length} customers
            </div>
          }
          <BootstrapTable
            data={packedCustomers || []}
            keyField="_id"
            options={{
              defaultSortName: "_id",
              defaultSortOrder: 'desc',
              noDataText: loading ? '' : 'Nothing to pack',
              sizePerPageDropDown: this.renderSizePerPageDropDown
            }}
            selectRow={{
              mode: 'checkbox',
              customComponent: this.select,
              onSelect: this.handleSelect,
              onSelectAll: this.handleSelectAll,
              selected,
              unselectable,
              columnWidth: '55px'
            }}
            hover
            striped
            pagination
            search
          >
            <TableHeaderColumn dataField="_id" width="70px" dataSort>#</TableHeaderColumn>
            <TableHeaderColumn dataField="fullName" width="125px">Customer Name</TableHeaderColumn>
            <TableHeaderColumn dataField="householdSummary" width="90px">
              Household
            </TableHeaderColumn>
            <TableHeaderColumn dataField="lastPacked" width="150px" dataFormat={lastPacked => formatDate(lastPacked)} >
              Last Packed On
            </TableHeaderColumn>
            <TableHeaderColumn dataField="packingList" dataFormat={this.getItemList}>
              Preferred Foods
            </TableHeaderColumn>
            <TableHeaderColumn dataFormat={this.getPackButton}/>
          </BootstrapTable>
          <div className="box-footer">
            <Button
              bsStyle="success"
              onClick={this.packSelected}
              disabled={!selected.length}
            >
              Mark Selected Customers Packed with their preferred foods
            </Button>
          </div>
        </BoxBody>

        {this.state.showModal &&
          <PackModal
            customer={this.state.modalCustomer}
            allFoods={this.props.allItems}
            scheduledFoods={this.props.scheduledItems}
            closeModal={this.closePackModal}
            packSelected={this.props.packSelected}
            packSaving={this.props.packSaving}
            packSaveError={this.props.packSaveError}
          />
        }
      </Box>
    )
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPackedCustomers
)(PackingList)

function getPackedCustomersAndItems(customers, items) {
  let itemCounts = items.map(item => item.quantity)

  // generate a packing list for each customer
  const packedCustomers = customers.filter(filterCustomersByLastPackedDate).map(customer => ({
    ...customer,
    packingList: items.map((item, i) => {
      // If the item is in the customer's food preferences and in stock
      // add it to customers packing list and decrement its count
      if (customer.foodPreferences.find(equalIds(item)) && itemCounts[i] > 0) {
        itemCounts[i]--
        return item
      }
    }).filter(exists)
  }))

  // generate a list of updated items after packing
  const updatedItems = items.map((item, i) => ({
    ...item,
    quantity: itemCounts[i]
  }))

  return {packedCustomers, updatedItems}
}

function equalIds(thing) {
  return other => thing && other && thing._id === other._id
}

function exists(thing) {
  return thing
}

function formatDate(date) {
  if (moment(date).isValid()) {
    return moment(date).format("MM/DD/YYYY")
  } else {
    return " "
  }
}

/**
 * Used to filter out customers that have been packed since MIN_DAYS_SINCE_LAST_PACKED_TO_SHOW
 */
function filterCustomersByLastPackedDate(customer) {
  let showBeforeDate = new Date()
  showBeforeDate.setDate(showBeforeDate.getDate() - MIN_DAYS_SINCE_LAST_PACKED_TO_SHOW)
  showBeforeDate = new Date(showBeforeDate.toDateString())

  let lastPacked = new Date(new Date(customer.lastPacked).toDateString())
  return (lastPacked <= showBeforeDate)
}
